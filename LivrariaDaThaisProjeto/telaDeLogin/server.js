const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 🔧 Middleware para parsear JSON
app.use(express.json());

// 🔧 Middleware para servir arquivos estáticos (como HTML, CSS, JS e imagens)
// Isso permite acessar index.html, login.html etc. via navegador
app.use(express.static(path.join(__dirname, '..'))); // Volta uma pasta e serve tudo

// 🔧 Middleware CORS para permitir qualquer origem
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 🔐 Rota para criar conta
app.post('/criarConta', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send("Preencha todos os campos.");
    }

    const tipoUsuario = email.endsWith("@email.gerente.com") ? "gerente" : "cliente";
    const linha = `"${email}";"${nome}";"${senha}";"${tipoUsuario}"\n`;

    const caminhoCSV = path.join(__dirname, 'usuarios.csv');

    fs.appendFile(caminhoCSV, linha, (err) => {
        if (err) {
            console.error("Erro ao salvar usuário:", err);
            return res.status(500).send("Erro interno ao salvar o usuário.");
        }

        console.log("Usuário salvo com sucesso:", linha.trim());
        res.json({ mensagem: "Conta criada com sucesso!", tipo: tipoUsuario });
    });
});

// 🔐 Rota para login (corrigida aqui!)
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send("Email e senha são obrigatórios.");
    }

    const caminhoCSV = path.join(__dirname, 'usuarios.csv');

    fs.readFile(caminhoCSV, 'utf8', (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err);
            return res.status(500).send("Erro ao ler dados de usuários.");
        }

        const linhas = data.trim().split('\n');

        for (const linha of linhas) {
            const [csvEmail, , csvSenha, csvTipo] = linha.split(';').map(c => c.replace(/"/g, '').trim());

            if (csvEmail === email && csvSenha === senha) {
                return res.json({ mensagem: "Login realizado com sucesso!", tipo: csvTipo });
            }
        }

        res.status(401).send("Email ou senha inválidos.");
    });
});

// Serve arquivos estáticos (como HTML, JS e CSS)
app.use(express.static(__dirname));

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});
