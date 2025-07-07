const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS para permitir qualquer origem
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/gerente', (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    // Validação: se faltar email ou senha, dá erro
    if (!email || !senha) {
        return res.status(400).send('Insira um valor válido!');
    }

    let tipoUsuario;
    if (email.endsWith("@email.gerente.com")) {
        tipoUsuario = "gerente";
    } else {
        tipoUsuario = "cliente";
    }

    console.log(`Email recebido: ${email}, senha recebida: ${senha}, a pessoa é: ${tipoUsuario}`);

    res.send(`Bem-vindo, ${tipoUsuario}`);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
