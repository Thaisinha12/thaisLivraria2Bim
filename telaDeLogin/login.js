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
    } else {
        alert("Conta criada com sucesso!");
    }
}

async function enviarValoresAoServidor() {
    debugger;

    try {
                                                                   
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })
        });
        
        const resultado = await response.text();
        debugger;
        document.getElementById("respostaDoServidor").innerHTML = resultado;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro na comunicação com o servidor');
    }
}

    async function jaTemUmaConta() {
        alert("Redirecionando para a página de login...");
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
      
        if (!email || !senha) {
          alert("Por favor, preencha todos os campos.");
          return;
        }
      
        try {
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })
          });
      
          const resultado = await response.text();
          document.getElementById("respostaDoServidor").innerHTML = resultado;
        } catch (error) {
          console.error('Erro:', error);
          alert('Erro ao tentar fazer login.');
        }
      }
    