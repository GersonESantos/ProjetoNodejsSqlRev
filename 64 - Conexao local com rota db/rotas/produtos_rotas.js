// Importar o módulo express
const express = require('express');

// Extraíndo a função Router do módulo express
const router = express.Router();

// Importar módulo de serviços
const servico = require('../servicos/produto_servico');
 
// Rota principal
router.get('/', function(req, res){
    // servico.formularioCadastro(req, res);
    res.write('Utilizando MySQL com Node.js');
    res.end()
});


 
// Exportar o router
module.exports = router;