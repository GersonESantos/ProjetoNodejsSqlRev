// Importar módulo express
const express = require('express');


// importar módulo de serviços
const servico = require('./servicos/produto_servico');
// App
const app = express();

// Conexão com o banco de dados


// Rota de teste
app.get('/', function(req, res){
    servico.formularioCadastro(req, res);
    
});

// Servidor
app.listen(8080);