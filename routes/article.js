'use strict'

//Importar express y el router de express para la creación de rutas.
var express = require('express');
var router = express.Router();

//Importar y configurar el connect multiparty para la subida de archivos
var multiparty = require('connect-multiparty');
var middleware_upload = multiparty({ uploadDir: './upload/articles' });

//Importar el controlador de article para vincular una ruta a una acción del controlador 
var ArticleController = require('../controllers/article');

/*--------Creando las rutas.--------*/

//Rutas de artículos
router.post('/save', ArticleController.save);
router.get('/articles', ArticleController.getArticles);
router.get('/article/:id?', ArticleController.getArticle);
router.get('/last', ArticleController.getLast);
router.get('/get-image/:image', ArticleController.getImage);
router.put('/update/:id?', ArticleController.update);
router.delete('/delete/:id?', ArticleController.delete);
router.post('/upload-image/:id?', middleware_upload, ArticleController.upload); //aplicando el middleware configurado para la subida de imágenes
router.get('/search/:search', ArticleController.search);

//Rutas de prueba
router.post('/datos-del-curso', ArticleController.datosCurso);

//Exportar las rutas
module.exports = router;