// Importar módulo express
const express = require('express');

//importar módulo fileupload

const fileUpload = require('express-fileupload');
// importar módulo express-handlebars

const exphbs = require('express-handlebars');

// importar módulo de serviços
const servico = require('./servicos/produto_servico');

// Path
const path = require('path');
// App
const app = express();

// habilitar fileupload
app.use(fileUpload());  


// Adicionar css

app.use('/css', express.static('./css'));
//Referenciar a pasta imagens
app.use('/imagens', express.static('./imagens'));
// Configuração do handlebars

// Configuração do express-handlebars
app.engine('handlebars', exphbs({
  helpers: {
    // Função auxiliar para verificar igualdade
    condicionalIgualdade: function (parametro1, parametro2, options) {
      return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
    }
  }
}));
app.set('view engine', 'handlebars');

// Manipulação de dados via Rotas

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Rota principal
app.get('/', function(req, res){
    servico.formularioCadastro(req, res);
});
// Rota principal contendo a situacao
app.get('/:situacao', function(req, res){
  servico.formularioCadastroComSituacao(req, res);  
      
});

app.get('/listar/:categoria', function(req, res){
 servico.listagemProdutos(req, res);   
});
// Rota de pesquisa

app.post('/pesquisa', function pesquisa(req, res){
    servico.pesquisa(req, res);    
}); 

//Fim da rota de pesquisa

// Rota de cadastro
app.post('/cadastrar', function(req, res){
    servico.cadastrarProduto(req, res);
 });
// Rota para remover produtos
app.get('/remover/:codigo&:imagem', function(req, res){
    servico.removerProduto(req, res);
});
    
   // Rota para redirecionar para o formulário de alteração/edição
app.get('/formularioEditar/:codigo', function(req, res){
    servico.formularioEditar(req, res); 
});

// Rota para editar produtos
app.post('/editar', function(req, res){
    servico.editarProduto(req, res);
});

// Servidor
app.listen(21100);