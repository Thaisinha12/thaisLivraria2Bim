// Variáveis do carrinho
let cart = [];

// Adiciona ao carrinho lendo os dados diretamente do HTML do livro
function addBookToCart(button) {
    const bookElement = button.closest(".book");
    const title = bookElement.querySelector("h3").textContent;
    const priceStr = bookElement.querySelector(".price").textContent.trim();
    const imgSrc = bookElement.querySelector("img").src;

    addToCart(title, priceStr, imgSrc);
}

function addToCart(title, priceStr, imgSrc) {
    // Preço em número para cálculos
    const price = parseFloat(priceStr.replace("R$ ", "").replace(",", "."));

    // Verificar se o livro já está no carrinho
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
        document.getElementById("cart-items").innerHTML = "<p>Seu carrinho está vazio.</p>";
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

    document.getElementById("checkout-form").style.display = "none";
    document.getElementById("pix-qrcode").style.display = "block";

    const totalText = document.getElementById("cart-total").innerText; // Ex: "Total: R$ 120,00"
    const totalValue = parseFloat(totalText.replace("Total: R$ ", "").replace(",", "."));

    document.getElementById("pix-amount").innerText = totalText;

    // Gerar código Pix no formato simples para QRCode
    // Vamos usar um link Pix no formato: "pix://000201... valor"
    // Como é simulação, vamos criar uma string que funcione em apps bancários para abrir a tela do Pix com valor preenchido
    // Para isso, vamos gerar um "payload" simples (exemplo fixo que a maioria dos apps aceita):

    const pixKey = "00000000-0000-0000-0000-000000000000"; // chave Pix fake (pode ser e-mail, CPF, celular etc)

    // Montando URI Pix: "pix:<chave>?amount=<valor>"
    // O valor precisa no formato 0.00 com ponto
    const amountStr = totalValue.toFixed(2);

    const pixUri = `pix:${pixKey}?amount=${amountStr}`;

    // Gerar QR Code com essa URI e mostrar na img

    generateQRCode(pixUri);
}

function generateQRCode(data) {
    // Usar biblioteca QRCode.js para gerar QRCode na img#qrcode-img

    // Se ainda não tiver a lib, pode usar o CDN no HTML:
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

    // Aqui, vamos criar um canvas temporário e substituir a imagem:

    const qrContainer = document.getElementById("qrcode-img");
    qrContainer.innerHTML = ""; // limpar imagem anterior se for container

    // Como qrcode-img é <img>, vamos trocar por um div para gerar QRCode dentro
    // Para evitar mexer no HTML, vamos substituir a imagem por um div no JS

    const parent = qrContainer.parentNode;
    const newDiv = document.createElement("div");
    newDiv.id = "qrcode-img";
    newDiv.style.width = "200px";
    newDiv.style.height = "200px";
    parent.replaceChild(newDiv, qrContainer);

    // Agora gerar QR Code com a lib

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

    // Limpa resultados anteriores
    searchResult.innerHTML = '';

    if (input === '') {
        // Se campo vazio, não mostra nada em search-result
        searchResult.style.display = 'none';
        return;
    }

    // Mostra o container do resultado
    searchResult.style.display = 'block';

    // Percorre os livros e encontra os que batem com a pesquisa
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

// Função para validar CPF
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

// Função para completar compra com validação de CPF
function completePurchase(event) {
    event.preventDefault();

    const cpf = prompt("Confirme o seu CPF, por favor! 😉");
    
    if (cpf && validarCPF(cpf)) {
        // CPF válido, segue o processo de checkout
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

