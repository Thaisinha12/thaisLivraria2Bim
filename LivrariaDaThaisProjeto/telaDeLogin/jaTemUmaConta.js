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

    const dados = await response.json();
    document.getElementById("respostaDoServidor").innerHTML = dados.mensagem;

    console.log("Resposta do servidor:", dados); // para depuração

    if (dados.mensagem.toLowerCase().includes("sucesso")) {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("usuarioLogado", email);
      sessionStorage.setItem("clienteAutenticado", "true");

      alert("Login realizado com sucesso!");

      // Verifica se há livro pendente para adicionar ao carrinho
      const livroSalvo = sessionStorage.getItem("livroParaAdicionar");
      if (livroSalvo) {
        const { title, priceStr, imgSrc } = JSON.parse(livroSalvo);
        sessionStorage.setItem("livroPendente", JSON.stringify({ title, priceStr, imgSrc }));
        sessionStorage.removeItem("livroParaAdicionar");
      }

      // Redireciona com base no tipo retornado pelo backend
      if (dados.tipo === "gerente") {
        window.location.href = "../gerente.html";
      } else {
        window.location.href = "../index.html";
      }

    } else {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("usuarioLogado");
      sessionStorage.removeItem("clienteAutenticado");
      alert("Login falhou: " + dados.mensagem);
    }

  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao tentar fazer login.");
  }
}
