// Importar módulo express Meu
const express = require('express');
// Importar módulo fileupload
const fileUpload = require('express-fileupload');
// importar módulo express-handlebars
const exphbs = require('express-handlebars');
// importar módulo de rotas
const rota_produto = require('./rotas/produtos_rotas');
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

//Configuração o caminho da pasta de visualização usando o metodo app.set
app.set('views', path.join(__dirname, 'views'));
// Manipulação de dados via Rotas

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// rotas
app.use('/', rota_produto);

// Servidor
app.listen(21100);