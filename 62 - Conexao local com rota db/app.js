// Importar módulo express
const express = require('express');



// App
const app = express();

// Conexão com o banco de dados
const Conexao = require('./bd/conexao_mysql');

// Rota de teste
app.get('/', function(req, res){

    res.write('Utilizando MySQL com Node.js');
    res.end();
});

// Servidor
app.listen(8080);