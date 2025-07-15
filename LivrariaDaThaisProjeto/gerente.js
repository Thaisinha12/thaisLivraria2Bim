// === CRUD DE LIVROS COM LOCALSTORAGE ===
let livros = JSON.parse(localStorage.getItem('livros')) || [];
let indexEditando = null;

const formLivros = document.getElementById('formLivros');
const titulo = document.getElementById('titulo');
const preco = document.getElementById('preco');
const tabelaLivros = document.getElementById('tabelaLivros');

function salvarLivrosNoLocalStorage() {
  localStorage.setItem('livros', JSON.stringify(livros));
}

formLivros.addEventListener('submit', (e) => {
  e.preventDefault();

  const livro = {
    titulo: titulo.value,
    preco: parseFloat(preco.value).toFixed(2)
  };

  if (indexEditando === null) {
    livros.push(livro);
  } else {
    livros[indexEditando] = livro;
    indexEditando = null;
  }

  formLivros.reset();
  salvarLivrosNoLocalStorage();
  renderizarLivros();
});

function carregarLivrosCSV(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const linhas = e.target.result.split('\n').filter(l => l.trim() !== '');
    livros = [];

    linhas.forEach((linha, index) => {
      const partes = linha.split(';').map(s => s.replace(/"/g, "").trim());
      const titulo = partes[0];
      let preco = partes[1] || "";

      preco = preco.replace("R$", "").replace(",", ".").trim();
      const precoNum = parseFloat(preco);

      if (!isNaN(precoNum)) {
        livros.push({ titulo, preco: precoNum.toFixed(2) });
      }
    });

    salvarLivrosNoLocalStorage();
    renderizarLivros();
  };

  reader.readAsText(file);
}

function renderizarLivros() {
  tabelaLivros.innerHTML = '';
  livros.forEach((livro, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${livro.titulo}</td>
      <td>R$ ${livro.preco.replace(".", ",")}</td>
      <td>
        <button onclick="editarLivro(${index})">✏️</button>
        <button onclick="removerLivro(${index})">🗑️</button>
      </td>
    `;
    tabelaLivros.appendChild(tr);
  });
}

function editarLivro(index) {
  const livro = livros[index];
  titulo.value = livro.titulo;
  preco.value = livro.preco;
  indexEditando = index;
}

function removerLivro(index) {
  livros.splice(index, 1);
  salvarLivrosNoLocalStorage();
  renderizarLivros();
}

function baixarLivros() {
  const conteudo = livros
    .map(l => `"${l.titulo}";"${parseFloat(l.preco).toFixed(2).replace(".", ",")}"`)
    .join('\n');

  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'livros.csv';
  link.click();
}

document.getElementById('livrosCSV').addEventListener('change', carregarLivrosCSV);

// === CLIENTES ===

const tabelaClientes = document.getElementById('tabelaClientes');

function carregarUsuariosCSV(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const linhas = e.target.result.split('\n').filter(l => l.trim() !== '');
    tabelaClientes.innerHTML = '';

    linhas.forEach((linha, index) => {
      if (index === 0) return; // pula cabeçalho

      const partes = linha.split(';').map(c => c.replace(/"/g, "").trim());
      const email = partes[0];
      const nome = partes[1];

      if (nome && email) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${nome}</td><td>${email}</td>`;
        tabelaClientes.appendChild(tr);
      }
    });
  };

  reader.readAsText(file);
}

document.getElementById('usuariosCSV').addEventListener('change', carregarUsuariosCSV);

renderizarLivros();
