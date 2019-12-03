'use strict'
//Cargar Mongoose
var mongoose = require('mongoose');
//Importar la configuración de express + las rutas
var app = require('./app');
//Asignar el puerto donde el servidor escuchará las peticiones
var port = 3900;
//Desactivar funciones antigüas de mongoose
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
//Conectar mongoose a MongoDB 
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        /*----Conexión establecida----*/
        console.log("Conexión establecida con MongoDB");
        console.log("Servidor escuchando en: http://localhost:" + port);
        /*Crear servidor y escuchar peticiones HTTP por el puerto configurado*/
        app.listen(port, () => {});
    });