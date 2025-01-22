// Importar módulo express
const express = require('express');
// importar módulo de serviços
const servico = require('./servicos/produto_servico');


// App
const app = express();



// Rota de teste
app.get('/', function(req, res){
    //servico.formularioCadastro(req, res);
    res.write('Utilizando MySQL com Node.js');
    res.end();
});

// Servidor
app.listen(8080);