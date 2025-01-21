// Importar o módulo express
const express = require('express');

// Extraíndo a função Router do módulo express
const router = express.Router();

// Importar módulo de serviços
const servico = require('../servicos/produto_servico');

// ***  ROTAS 
// Rota principal
router.get('/', function(req, res){
    servico.formularioCadastro(req, res);

});
// Rota principal contendo a situacao
router.get('/:situacao', function(req, res){
  servico.formularioCadastroComSituacao(req, res);  
      
});

router.get('/listar/:categoria', function(req, res){
 servico.listagemProdutos(req, res);   
});
// Rota de pesquisa

router.get('/pesquisa', function pesquisa(req, res){
    servico.pesquisa(req, res);    
}); 

//Fim da rota de pesquisa

// Rota de cadastro
router.get('/cadastrar', function(req, res){
    servico.cadastrarProduto(req, res);
 });
// Rota para remover produtos
router.get('/remover/:codigo&:imagem', function(req, res){
    servico.removerProduto(req, res);
});
    
   // Rota para redirecionar para o formulário de alteração/edição
router.get('/formularioEditar/:codigo', function(req, res){
    servico.formularioEditar(req, res); 
});

// Rota para editar produtos
router.get('/editar', function(req, res){
    servico.editarProduto(req, res);
});
// Exportar o router
module.exports = router;