const express = require('express');
const app = express();
const gerenteRoutes = require('./routes/gerente');

app.use(express.json()); // Permite o uso de JSON no body
app.use('/gerente', gerenteRoutes); // Prefixo das rotas

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CRUD do gerente rodando na porta ${PORT}`);
});
