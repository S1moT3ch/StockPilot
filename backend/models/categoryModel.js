//import della libreria mongoose
const mongoose = require('mongoose');

//schemaType per le categorie
const categorySchema = new mongoose.Schema({
    nome: { type: String, required: true }
})

module.exports = mongoose.model('Category', categorySchema)