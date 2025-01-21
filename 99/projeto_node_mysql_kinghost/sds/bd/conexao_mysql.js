// Importar módulo mysql
const mysql = require('mysql');

// Configuração de conexão
const conexao = mysql.createConnection({
    host:'mysql.ralflima.com.br',
    user:'ralflima',
    password:'node123',
    database:'ralflima'
});

// Teste de conexão
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('Conexão efetuada com sucesso!');
});

// Exportar módulo
module.exports = conexao;