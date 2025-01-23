// Importar módulo express
const express = require('express');
// importar módulo de rotas
const rota_produto = require ('./rotas/produtos_rotas');
// App
const app = express();
// Rota
app.use('/', rota_produto);
// Servidor
app.listen(8080);