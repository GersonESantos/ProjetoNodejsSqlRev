// Importar módulo express
const express = require('express');

//importar módulo fileupload

const fileUpload = require('express-fileupload');
// importar módulo express-handlebars

const { engine } = require('express-handlebars');

// Importar módulo mysql
const mysql = require('mysql2');
// fileupload
const fs = require('fs');
// App
const app = express();

// habilitar fileupload
app.use(fileUpload());  

// Adicionar bootstrap

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
// Adicionar css

app.use('/css', express.static('./css'));
//Referenciar a pasta imagens
app.use('/imagens', express.static('./imagens'));
// Configuração do handlebars

// Configuração do express-handlebars
app.engine('handlebars', engine({
    helpers: {
      // Função auxiliar para verificar igualdade
      condicionalIgualdade: function (parametro1, parametro2, options) {
        return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
      }
    }
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');
// Manipulação de dados via Rotas

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

// Rota principal contendo a situacao
app.get('/:situacao', function(req, res){
    // SQL
    let sql = 'SELECT * FROM produtos';  
    // Executar comando SQL
    Conexao.query(sql, function(erro, retorno){
        res.render('formulario', {produtos: retorno, situacao: req.params.situacao});  
});
}
);




// Rota para cadastro
// Rota de cadastro
app.post('/cadastrar', function(req, res){
    try{
      // Obter os dados que serão utiliados para o cadastro
      let nome = req.body.nome;
      let valor = req.body.valor;
      let imagem = req.files.imagem.name;
 
      // Validar o nome do produto e o valor
      if(nome == '' || valor == '' || isNaN(valor)){
         res.redirect('/falhaCadastro');
      }else{
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
         res.redirect('/okCadastro');
      }
    }catch(erro){
     res.redirect('/falhaCadastro');
    }
 });
// Rota para remover produtos
app.get('/remover/:codigo&:imagem', function(req, res){
    
    // Tratamento de exeção
    try{
        // SQL
        let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

        // Executar o comando SQL
        Conexao.query(sql, function(erro, retorno){
            // Caso falhe o comando SQL
            if(erro) throw erro;

            // Caso o comando SQL funcione
            fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem)=>{
                console.log('Falha ao remover a imagem ');
            });
        });

        // Redirecionamento
        res.redirect('/okRemover');
    }catch(erro){
        res.redirect('/falhaRemover');
    }

});
    
   // Rota para redirecionar para o formulário de alteração/edição
app.get('/formularioEditar/:codigo', function(req, res){
    
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;
        // Executar comando SQL
        Conexao.query(sql, function(erro, retorno){
            // Caso ocorra algum erro
            if(erro) throw erro;
            
            res.render('formularioEditar', {produto: retorno[0]});
    
    });
});

// Rota para editar produtos
app.post('/editar', function(req, res){

    // Obter os dados do formulário
    let nome = req.body.nome;
    let valor = req.body.valor;
    let codigo = req.body.codigo;
    let nomeImagem = req.body.nomeImagem;

    // Validar nome do produto e valor
    if(nome == '' || valor == '' || isNaN(valor)){
        res.redirect('/falhaEdicao');
    }else {

        // Definir o tipo de edição
        try{
            // Objeto de imagem
            let imagem = req.files.imagem;

            // SQL
            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor}, imagem='${imagem.name}' WHERE codigo=${codigo}`;
    
            // Executar comando SQL
            Conexao.query(sql, function(erro, retorno){
                // Caso falhe o comando SQL
                if(erro) throw erro;

                // Remover imagem antiga
                fs.unlink(__dirname+'/imagens/'+nomeImagem, (erro_imagem)=>{
                    console.log('Falha ao remover a imagem.');
                });

                // Cadastrar nova imagem
                imagem.mv(__dirname+'/imagens/'+imagem.name);
            });
        }catch(erro){
            
            // SQL
            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor} WHERE codigo=${codigo}`;
        
            // Executar comando SQL
            Conexao.query(sql, function(erro, retorno){
                // Caso falhe o comando SQL
                if(erro) throw erro;
            });
        }

        // Redirecionamento
        res.redirect('/okEdicao');
    }
});

// Servidor
app.listen(8080);