// Criar objeto app
const express = require('express');
const app = express();

// Rotas
app.get('/', function(req, res){
    // Exibir mensagem
    res.write("Utilizando o Express na KingHost!");
    
    // Exibir rota
    res.end();
});

app.get('/:nome', function(req, res){
    // Exibir mensagem
    res.write("Oi " + req.params.nome);
    
    // Finalizar rota
    res.end();
});

// Porta do servidor 
 app.listen(21100);

