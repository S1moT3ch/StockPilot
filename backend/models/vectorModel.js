const mongoose = require('mongoose')

//schemaType per i vettori
const vectorSchema = new mongoose.Schema({
    azienda: {
        type: String,
        required: [true, "Il nome dell'azienda è obbligatorio"],
    },

    trasportatore: {
        type: String,
        required: [true, "Il nome del trasportore è obbligatorio"],
    },

    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La categoria è obbligatoria'],
    }
})

module.exports = mongoose.model('Vector', vectorSchema);