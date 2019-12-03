'use strict'
//cargar mongoose y su método de schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//crear el schema con las propiedades de la colección
var ArticleSchema = Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    image: String
});
/*******
 * - Exportar el modelo 'Article' con su tipo de schema
 * - Acción de mongoose "model" pluralizará el nombre de la colección.
 ********/
module.exports = mongoose.model('Article', ArticleSchema);