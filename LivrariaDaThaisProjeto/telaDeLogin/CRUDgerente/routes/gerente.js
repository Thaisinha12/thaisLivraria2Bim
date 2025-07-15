const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './data.json';

// Função para ler os livros do arquivo JSON
function lerLivros() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Função para salvar os livros no arquivo JSON
function salvarLivros(livros) {
  fs.writeFileSync(filePath, JSON.stringify(livros, null, 2));
}

// CREATE – Adicionar novo livro
router.post('/livros', (req, res) => {
  const livros = lerLivros();
  const novoLivro = req.body;
  novoLivro.id = Date.now();
  livros.push(novoLivro);
  salvarLivros(livros);
  res.status(201).json(novoLivro);
});

// READ – Listar todos os livros
router.get('/livros', (req, res) => {
  const livros = lerLivros();
  res.json(livros);
});

// READ – Obter um livro por ID
router.get('/livros/:id', (req, res) => {
  const livros = lerLivros();
  const livro = livros.find(l => l.id == req.params.id);
  if (!livro) return res.status(404).send('Livro não encontrado');
  res.json(livro);
});

// UPDATE – Atualizar um livro por ID
router.put('/livros/:id', (req, res) => {
  const livros = lerLivros();
  const id = parseInt(req.params.id);
  const index = livros.findIndex(l => l.id === id);

  if (index === -1) return res.status(404).send('Livro não encontrado');

  livros[index] = { ...livros[index], ...req.body };
  salvarLivros(livros);
  res.json(livros[index]);
});

// DELETE – Remover um livro por ID
router.delete('/livros/:id', (req, res) => {
  const livros = lerLivros();
  const id = parseInt(req.params.id);
  const novosLivros = livros.filter(l => l.id !== id);

  if (novosLivros.length === livros.length) {
    return res.status(404).send('Livro não encontrado');
  }

  salvarLivros(novosLivros);
  res.status(204).send();
});

module.exports = router;
