// Importar módulo express
const express = require('express');

const mysql = require('mysql2');

// App
const app = express();

// Conexão com o banco de dados
const Conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gabibi89*',
    database: 'projeto'
}); 
// Conectar
Conexao.connect(function(err){
    if(err) throw err;
    console.log('Conectado com sucesso!');
}
);

// Rota de teste
app.get('/', function(req, res){

    res.write('Utilizando MySQL com Node.js');
    res.end();
});

// Servidor
app.listen(8080);