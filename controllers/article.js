'use strict'
//Importar librerías necesarias
var validator = require('validator');
var fs = require('fs'); //file system
var path = require('path'); //sacar la ruta en el sistema de archivos en el servidor

//Importar modelo para la creación de objetos y gestión de base de datos
var Article = require('../models/article');
//El controlador será un objeto literal con todas las funciones y métodos
var controller = {
    save: function (req, res) {
        //1. Recoger los datos recibidos por POST
        var params = req.body;
        //2. Validar datos con VALIDATOR - Datos sensibles a causar excepciones (solución: try - catch)
        try {
            //DATOS OBLIGATORIOS: comprobrar que recibimos por post datos, es decir, tienen un valor diferente a empty
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.send({
                status: 'error',
                code: 200,
                message: 'Faltan datos.'
            });
        }

        if (validate_title && validate_content) { //validación correcta
            //3. Crear el objeto a guardar (instanciar el modelo)
            var article = new Article();
            //4. Asignar valores al objeto
            article.title = params.title;
            article.content = params.content;
            var image = params.image;
            if (image != undefined && image != null && image != "") {
                article.image = image;
            } else {
                article.image = null;
            }
            //5. Guardar el Artículo y Crear una respuesta
            article.save(function (err, articleStored) {
                if (err || !articleStored) {
                    return res.send({
                        status: 'error',
                        code: 400,
                        message: 'Ha ocurrido un error al guardar el artículo'
                    });
                }
                return res.send({
                    status: 'success',
                    code: 200,
                    message: 'Artículo creado correctamente',
                    article: articleStored
                });

            });
        } else { //error de validación
            if (validate_title == false) {
                return res.send({
                    status: 'error',
                    code: 200,
                    message: 'El título no puede estar vacío'
                });
            } else if (validate_content == false) {
                return res.send({
                    status: 'error',
                    code: 200,
                    message: 'El contenido no puede estar vacío'
                });
            }
        }
    },
    getArticles: function (req, res) {
        //Find all
        Article.find().sort('-_id').exec(function (err, articles) {
            if (err) {
                return res.send({
                    status: 'error',
                    code: 500,
                    message: 'Error al devolver los artículos'
                });
            }
            if (!articles) {
                return res.send({
                    status: 'error',
                    code: 404,
                    message: 'No hay artículos para mostrar'
                });
            }

            return res.send({
                status: 'success',
                code: 200,
                articulos: articles
            });
        });
    },
    getLast: function (req, res) {
        //find last 5 articles
        Article.find().limit(5).sort('-_id').exec(function (err, lastArticles) {
            if (err) {
                return res.send({
                    status: 'error',
                    code: 500,
                    message: 'Error al devolver los artículos'
                });
            }
            if (!lastArticles) {
                return res.send({
                    status: 'error',
                    code: 404,
                    message: 'No hay artículos para mostrar'
                });
            }

            return res.send({
                status: 'success',
                code: 200,
                ultimos: lastArticles
            });
        });
    },
    getArticle: function (req, res) {
        //Recoger el id del artículo por URL
        var articleId = req.params.id;
        //Comprobar si llego el id
        if (!articleId || articleId == null) {
            return res.send({
                status: 'error',
                code: 404,
                message: 'No se recibió el ID del artículo'
            });
        }

        //find by id
        Article.findById(articleId, (err, articleFound) => {
            if (err || !articleFound) {
                return res.send({
                    status: 'error',
                    code: 404,
                    message: 'Error al devolver los datos'
                });
            }
            return res.send({
                status: 'success',
                code: 200,
                articulo: articleFound
            });
        });
    },
    update: function (req, res) {
        //1. Recoger el id del articulo recibido por la url
        var articleId = req.params.id;
        if (!articleId) {
            return res.send({
                status: 'error',
                code: 404,
                message: 'No se recibió el ID del artículo'
            });
        }
        //2. Recoger los datos recibidos por PUT
        var params = req.body;
        //3. Validar datos con VALIDATOR - Datos sensibles a causar excepciones (solución: try - catch)
        try {
            //DATOS OBLIGATORIOS: comprobrar que recibimos por post datos, es decir, tienen un valor diferente a empty
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.send({
                status: 'error',
                code: 200,
                message: 'Faltan datos.'
            });
        }
        if (validate_title && validate_content) { //validación correcta
            //4. Find->Update y Crear una respuesta
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err || !articleUpdated) {
                    return res.send({
                        status: 'error',
                        code: 400,
                        message: 'Ha ocurrido un error al actualizar el artículo'
                    });
                }
                return res.send({
                    status: 'success',
                    code: 200,
                    message: 'Artículo actualizado correctamente',
                    article: articleUpdated
                });
            });
        } else { //error de validación
            if (validate_title == false) {
                return res.send({
                    status: 'error',
                    code: 200,
                    message: 'El título no puede estar vacío'
                });
            } else if (validate_content == false) {
                return res.send({
                    status: 'error',
                    code: 200,
                    message: 'El contenido no puede estar vacío'
                });
            }
        }
    },
    delete: function (req, res) {
        //Recoger el id del artículo que llega por la url
        var articleId = req.params.id;
        //Find and delete
        Article.findByIdAndDelete({ _id: articleId }, (err, articleDeleted) => {
            if (err || !articleDeleted) {
                return res.send({
                    status: 'error',
                    code: 404,
                    message: 'Ha ocurrido un error, no hemos podido eliminar el artículo'
                });
            }
            return res.send({
                status: 'success',
                code: 200,
                message: 'Artículo eliminado',
                articulo_eliminado: articleDeleted
            });
        });

    },
    upload: function (req, res) {
        //1. Configurar el módulo connect-multiparty en routes
        //2. Recoger el id del artículo al que se le asignará la imagen
        var articleId = req.params.id;
        if (!articleId) {
            return res.send({
                status: 'error',
                message: 'No hemos podido identificar a que artículo asignarle la imagen'
            })
        }
        //3. Recoger FILE recibido
        if (!req.files) {
            return res.send({
                status: 'error',
                code: 404,
                message: 'No se recibió ninguna imagen'
            });
        }
        var file = req.files.file0;
        var file_path = file.path
        var file_split = file_path.split('\\');
        //4. Conseguir el nombre y la extensión del FILE recibido
        var file_name = file_split[2];
        var file_type = file.type;
        //5. Comprobar la extensión del FILE, solo se admiten imágenes
        if (file_type != 'image/jpg' && file_type != 'image/jpeg' && file_type != 'image/gif' && file_type != 'image/png') {
            //Utilizar file system para evitar que se guarden archivos que no cumplan con la condición anterior
            fs.unlink(file_path, (err) => {
                return res.send({
                    status: 'error',
                    code: 400,
                    message: 'Algo ha ido mal con la extensión'
                });
            });
            return res.send({
                status: 'error',
                code: 400,
                message: 'Sólo se admiten imagenes'
            });
        } //extensión válida - seguimos
        //6. Buscar artículo, asignarle el nombre de la imágen y actualizar
        Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
            if (err || !articleUpdated) {
                fs.unlink(file_path, (err) => {
                    return res.send({
                        status: 'error',
                        code: 400,
                        message: 'Algo ha ido mal al buscar el artículo'
                    });
                });
                return res.send({
                    status: 'error',
                    code: 400,
                    message: 'No se ha podido actualizar la imagen probablemente el artículo no existe'
                });
            }
            return res.send({
                status: 'success',
                code: 200,
                message: 'Imagen cargada correctamente',
                file_name: file_name,
                articulo_updated: articleUpdated
            });
        });
    },
    getImage: function (req, res) {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.send({
                    status: 'error',
                    code: 404,
                    message: 'Imagen no conseguida'
                });
            }
        });
    },
    search: function (req, res) {
        var search = req.params.search;
        //Find "$or" operador que permite hacer búsquedas en múltiples campos ejemplo[titulo y contenido]
        Article.find({
            "$or": [
                { title: { "$regex": search, "$options": 'i' } },
                { content: { "$regex": search, "$options": 'i' } }
            ]
        })
            .sort([
                ['date', 'descending']
            ])
            .exec((err, articles) => {
                if (err) {
                    return res.send({
                        status: 'error',
                        code: 500,
                        message: 'Error en la petición'
                    });
                }
                var coincidencias = articles.length;
                if (!articles || coincidencias <= 0) {
                    return res.send({
                        status: 'error',
                        code: 404,
                        message: "No existen artículos que coincidan con la búsqueda '" + search + "'"
                    });
                }
                return res.send({
                    status: 'success',
                    code: 200,
                    coincidencias: coincidencias,
                    articles: articles
                });
            });
    },
    datosCurso: function (req, res) {
        var body = req.body;
        var alumno = req.body.alumno; //recibiendo los datos del formulario con índice alumno
        if (alumno == undefined) {
            res.send({
                code: 400,
                message: 'No se han recibido datos por POST'
            });
        } else {
            res.send({
                code: 200,
                curso: 'Master en Frameworks de JS',
                formador: 'Víctor Robles',
                alumno: alumno
            });
        }
    }
}; //end controller

module.exports = controller;