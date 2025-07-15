function criarConta() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let erros = [];

    if (!nome) {
        erros.push("• O nome completo deve ser preenchido.");
    }

    if (!regexEmail.test(email)) {
        erros.push("• O e-mail informado é inválido.");
    }

    if (senha.length < 6) {
        erros.push("• A senha deve conter no mínimo 6 caracteres.");
    }

    if (senha !== confirmarSenha) {
        erros.push("• A confirmação de senha está diferente da senha.");
    }

    if (erros.length > 0) {
        alert("Por favor, corrija os seguintes erros:\n\n" + erros.join("\n"));
        return;
    }

    // Envia os dados pro servidor
    fetch('http://localhost:3000/criarConta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    })
    .then(response => response.json())
    .then(dados => {
        alert(dados.mensagem);
    
        if (dados.mensagem.toLowerCase().includes("sucesso")) {
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("usuarioLogado", email);
    
            if (dados.tipo === "gerente") {
                window.location.href = "../gerente.html";
            } else {
                window.location.href = "../index.html";
            }
        }
    })
    
    .catch(error => {
        console.error("Erro ao criar conta:", error);
        alert("Erro ao tentar criar a conta.");
    });



}
