// Importar módulo mysql
const mysql = require('mysql');
// Conexão com o banco de dados
const Conexao = mysql.createConnection({
    host: 'mysql.gersones.com.br',
    user: 'gersones',
    password: 'Gabibi89',
    database: 'gersones'
}); 
// Conectar
Conexao.connect(function(err){
    if(err) throw err;
    console.log('Conectado com sucesso!');
}
);
// Exportar módulo
module.exports = Conexao;
