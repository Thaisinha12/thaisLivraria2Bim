function jaTemUmaConta() {
    // Redireciona para a nova tela de login
    window.location.href = "login.html";
  }  

async function fazerLogin() {
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
  