// Variáveis do carrinho
let cart = [];

// Adiciona ao carrinho lendo os dados diretamente do HTML do livro
function addBookToCart(button) {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        const bookElement = button.closest(".book");
        const title = bookElement.querySelector("h3").textContent;
        const priceStr = bookElement.querySelector(".price").textContent.trim();
        const imgSrc = bookElement.querySelector("img").src;

        // Salvar temporariamente no sessionStorage
        sessionStorage.setItem("livroPendente", JSON.stringify({
            title,
            priceStr,
            imgSrc
        }));

        alert("Faça login para adicionar o livro ao carrinho.");
        window.location.href = "telaDeLogin/login.html";
        return;
    }

    const bookElement = button.closest(".book");
    const title = bookElement.querySelector("h3").textContent;
    const priceStr = bookElement.querySelector(".price").textContent.trim();
    const imgSrc = bookElement.querySelector("img").src;

    addToCart(title, priceStr, imgSrc);
}

function addToCart(title, priceStr, imgSrc) {
    const price = parseFloat(priceStr.replace("R$ ", "").replace(",", "."));
    const existingItem = cart.find(item => item.title === title);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ title, price, imgSrc, quantity: 1 });
    }

    updateCartUI();
    openCart();
}

function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.title}" style="width:50px; height:75px; object-fit:cover;" />
            <span>${item.title}</span> - 
            <span>R$ ${item.price.toFixed(2).replace(".", ",")}</span> x 
            <input type="number" min="1" value="${item.quantity}" onchange="changeQuantity(${index}, this.value)" style="width: 50px;" />
            <button onclick="removeFromCart(${index})">Remover</button>
        `;

        cartItems.appendChild(itemDiv);
    });

    document.getElementById("cart-total").innerText = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
        document.getElementById("cart-total").innerText = "Total: R$ 0,00";
    }
}

function changeQuantity(index, quantity) {
    quantity = parseInt(quantity);
    if (quantity < 1) quantity = 1;
    cart[index].quantity = quantity;
    updateCartUI();
}

function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function openCart() {
    document.getElementById("cart").style.display = "block";
    document.getElementById("checkout-form").style.display = "none";
    document.getElementById("pix-qrcode").style.display = "none";
    document.getElementById("pix-confirmation").style.display = "none";
}

function closeCart() {
    document.getElementById("cart").style.display = "none";
}

function showCheckoutForm() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    document.getElementById("cart").style.display = "none";
    document.getElementById("checkout-form").style.display = "block";
}

function closeCheckoutForm() {
    document.getElementById("checkout-form").style.display = "none";
    document.getElementById("cart").style.display = "block";
}

function completePurchase(event) {
    event.preventDefault();

    const cpf = prompt("Confirme o seu CPF, por favor! 😉");
    if (cpf && validarCPF(cpf)) {
        document.getElementById("checkout-form").style.display = "none";
        document.getElementById("pix-qrcode").style.display = "block";

        const totalText = document.getElementById("cart-total").innerText;
        const totalValue = parseFloat(totalText.replace("Total: R$ ", "").replace(",", "."));

        document.getElementById("pix-amount").innerText = totalText;

        const pixKey = "00000000-0000-0000-0000-000000000000";
        const amountStr = totalValue.toFixed(2);
        const pixUri = `pix:${pixKey}?amount=${amountStr}`;

        generateQRCode(pixUri);
    } else {
        alert("CPF inválido!");
    }
}

function generateQRCode(data) {
    const qrContainer = document.getElementById("qrcode-img");
    qrContainer.innerHTML = "";

    const parent = qrContainer.parentNode;
    const newDiv = document.createElement("div");
    newDiv.id = "qrcode-img";
    newDiv.style.width = "200px";
    newDiv.style.height = "200px";
    parent.replaceChild(newDiv, qrContainer);

    new QRCode(newDiv, {
        text: data,
        width: 200,
        height: 200,
    });
}

function cancelPixPayment() {
    document.getElementById("pix-qrcode").style.display = "none";
    document.getElementById("cart").style.display = "block";
}

function showPixConfirmation() {
    const totalText = document.getElementById("cart-total").innerText;

    document.getElementById("pix-qrcode").style.display = "none";
    document.getElementById("pix-confirmation").style.display = "block";
    document.getElementById("confirm-amount").innerText = totalText;
}

function finalizePurchase() {
    alert("Compra finalizada com sucesso! Obrigado pela preferência.");
    cart = [];
    updateCartUI();
    document.getElementById("pix-confirmation").style.display = "none";
    closeCart();
}

function removeAcento(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function searchBook() {
    const input = removeAcento(document.getElementById('search-input').value.toLowerCase().trim());
    const books = document.querySelectorAll('main .book');
    const searchResult = document.getElementById('search-result');

    searchResult.innerHTML = '';

    if (input === '') {
        searchResult.style.display = 'none';
        return;
    }

    searchResult.style.display = 'block';

    let foundBooks = [];
    books.forEach(book => {
        const title = removeAcento(book.querySelector('h3').textContent.toLowerCase());
        if (title.includes(input)) {
            foundBooks.push(book.cloneNode(true));
        }
    });

    if (foundBooks.length === 0) {
        searchResult.innerHTML = '<p>Nenhum livro encontrado.</p>';
    } else {
        foundBooks.forEach(book => {
            searchResult.appendChild(book);
        });
    }
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

// 🔁 ADICIONA O LIVRO AO CARRINHO AUTOMATICAMENTE APÓS LOGIN
window.addEventListener("load", () => {
    const livroPendente = sessionStorage.getItem("livroPendente");
    if (livroPendente) {
        const { title, priceStr, imgSrc } = JSON.parse(livroPendente);
        addToCart(title, priceStr, imgSrc);
        sessionStorage.removeItem("livroPendente");
    }
});
