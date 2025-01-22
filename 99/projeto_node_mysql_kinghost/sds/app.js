// Importar módulo express
const express = require('express');
// Importar módulo fileupload
const fileupload = require('express-fileupload');

// Importar módulo express-handlebars
const exphbs = require('express-handlebars');

// Importar módulo de rotas
const rota_produto = require('./rotas/produtos_rota');

// Path
const path = require('path');

// App
const app = express();

// Habilitando o upload de arquivos
app.use(fileupload());

// Adicionar CSS
app.use('/css', express.static('./css'));

// Refereniar a pasta de imagens
app.use('/imagens', express.static('./imagens'));

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

// Configure o caminho da pasta de visualizações usando o método app.set
app.set('views', path.join(__dirname, 'views'));

// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Rotas
app.use('/', rota_produto);

// Servidor
app.listen(21100);