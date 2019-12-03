'use strict';
//Cargar módulos de node necesarios
var express = require('express');
var bodyParser = require('body-parser');
//Ejecutar express (http)
var app = express();
//Importar ficheros de rutas
var article_routes = require('./routes/article');
//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Configurar el CORS a express. [permisos a clientes rest a realizar peticiones http a nuestra API]
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//Cargar las rutas a express: [EN CASO DE NO COLOCAR PREFIJOS] => app.use(article_routes);
//O añadiendo prefijos(OPCIONAL)
app.use('/api', article_routes);
//Exportar este módulo
module.exports = app;