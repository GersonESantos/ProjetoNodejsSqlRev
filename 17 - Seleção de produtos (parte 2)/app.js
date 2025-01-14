// Importar módulo express
const express = require('express');

//importar módulo fileupload

const fileUpload = require('express-fileupload');
// importar módulo express-handlebars

const { engine } = require('express-handlebars');

// Importar módulo mysql
const mysql = require('mysql2');

// App
const app = express();

// habilitar fileupload
app.use(fileUpload());  

// Adicionar bootstrap

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
// Adicionar css

app.use('/css', express.static('./css'));
// Configuração do handlebars

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

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
// Rota principal
app.get('/', function(req, res){
    // SQL
    let sql = 'SELECT * FROM produtos';  
    // Executar comando SQL
    Conexao.query(sql, function(erro, retorno){
        res.render('formulario', {produtos: retorno});  
});
}
);
// Rota para cadastro
app.post('/cadastrar', function(req, res){
    // Obter os dados que serão utiliados para o cadastro
    let nome = req.body.nome;
    let valor = req.body.valor;
    let imagem = req.files.imagem.name;

    // SQL
    let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ('${nome}', ${valor}, '${imagem}')`;
        
    // Executar comando SQL
    Conexao.query(sql, function(erro, retorno){
        // Caso ocorra algum erro
        if(erro) throw erro;

        // Caso ocorra o cadastro
        req.files.imagem.mv(__dirname+'/imagens/'+req.files.imagem.name);
        console.log(retorno);
    });

    // Retornar para a rota principal
    res.redirect('/');
});

// Servidor
app.listen(8080);