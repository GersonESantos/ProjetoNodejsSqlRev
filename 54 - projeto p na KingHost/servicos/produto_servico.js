// Importar o módulo de conexão com banco MySQL Meu 
const Conexao = require('../bd/conexao_mysql');

// Importar o módulo file system
const fs = require('fs');
// Importar o módulo path
const path = require('path');

// Função para exibir o formulário para cadastro de produtos
function formularioCadastro(req, res){
    res.render('formulario');
}

// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){
    res.render('formulario', {situacao: req.params.situacao});
}

// Função para exibir o formulário para edição de produtos
function formularioEditar(req, res){
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Expires', '0');
    res.setHeader('Pragma', 'no-cache');

    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;
    // Executar comando SQL
    Conexao.query(sql, function(erro, retorno){
        // Caso ocorra algum erro
        if(erro) throw erro;
        
        res.render('formularioEditar', {produto: retorno[0]});

}); 
}

// Função para exibir a listagem de produtos
function listagemProdutos(req, res){
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Expires', '0');
    res.setHeader('Pragma', 'no-cache');

    // Obter categoria
    let categoria = req.params.categoria;

    // SQL
    let sql = '';

    if(categoria == 'todos'){
        sql = 'SELECT * FROM produtos ORDER BY RAND()';
    }else{
        sql = `SELECT * FROM produtos WHERE categoria = '${categoria}' ORDER BY nome ASC`;
    }

    // Executar comando SQL
    Conexao.query(sql, function(erro, retorno){
        res.render('lista', {produtos:retorno});
    });
}

// Função para realizar a pesquisa de produtos
function pesquisa(req, res){
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Expires', '0');
    res.setHeader('Pragma', 'no-cache');

    // Obter o termo pesquisado
    let termo = req.body.termo;

    // SQL
    let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`;

    // Executar comando SQL
    Conexao.query(sql, function(erro, retorno){
        let semRegistros = retorno.length == 0 ? true : false;

        res.render('lista', {produtos:retorno, semRegistros:semRegistros});
    });
}

// Função para realizar o cadastro de produtos
function cadastrarProduto(req, res){
    try{
        // Obter os dados que serão utiliados para o cadastro
        let nome = req.body.nome;
        let valor = req.body.valor;
        let categoria = req.body.categoria;
        let imagem = req.files.imagem.name;
   
        // Validar o nome do produto e o valor
        if(nome == '' || valor == '' || isNaN(valor) || categoria == '' ){
           res.redirect('/falhaCadastro');
        }else{
           // SQL
           let sql = `INSERT INTO produtos (nome, valor, imagem, categoria) VALUES ('${nome}', ${valor}, '${imagem}', '${categoria}')`; 
           
           // Executar comando SQL
           Conexao.query(sql, function(erro, retorno){
               // Caso ocorra algum erro
               if(erro) throw erro;
   
               // Caso ocorra o cadastro
               const diretorio = path.join(__dirname, '../');
              
               req.files.imagem.mv(diretorio+'/imagens/'+req.files.imagem.name);
           });
   
           // Retornar para a rota principal
           res.redirect('/okCadastro');
        }
      }catch(erro){
       res.redirect('/falhaCadastro');
      }
}

// Função para realizar a remoção de produtos
function removerProduto(req, res){
    // Tratamento de exceção
    try {
        // SQL para obter o nome da imagem associado ao código do produto
        let sqlConsulta = `SELECT imagem FROM produtos WHERE codigo = ${req.params.codigo}`;

        // Executar a consulta SQL para obter o nome da imagem
        Conexao.query(sqlConsulta, function(erroConsulta, resultadoConsulta) {
            if (erroConsulta) {
                throw erroConsulta;
            }

            // Verificar se o resultado da consulta contém a imagem
            if (resultadoConsulta.length > 0 && resultadoConsulta[0].imagem) {
                const nomeImagem = resultadoConsulta[0].imagem;

                // Caminho completo da imagem
                const caminhoImagem = path.join(__dirname, '../imagens', nomeImagem);

                // Excluir a imagem do diretório
                fs.unlink(caminhoImagem, function(erroImagem) {
                    if (erroImagem) {
                        console.log('Falha ao remover a imagem:', erroImagem);
                    } else {
                        console.log('Imagem removida com sucesso.');
                    }
                });
            }

            // SQL para excluir o registro do banco de dados
            let sqlExclusao = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

            // Executar o comando SQL de exclusão no banco de dados
            Conexao.query(sqlExclusao, function(erroExclusao, retornoExclusao) {
                if (erroExclusao) {
                    throw erroExclusao;
                }

                // Redirecionamento após a remoção bem-sucedida
                res.redirect('/okRemover');
            });
        });
    } catch (erro) {
        console.error('Erro ao remover o produto:', erro);
        res.redirect('/falhaRemover');
    }
}


// Função responsável pela edição de produtos
function editarProduto(req, res){
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
                const diretorio = path.join(__dirname, '../');
                req.files.imagem.mv(diretorio+'/imagens/'+req.files.imagem.name);
  
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
}

// Exportar funções
module.exports = {
    formularioCadastro,
    formularioCadastroComSituacao,
    formularioEditar,
    listagemProdutos,
    pesquisa,
    cadastrarProduto,
    removerProduto,
    editarProduto
};