const mongoose = require ('mongoose');

//schemaType per i prodotto

const productSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Il nome è obbligatorio'],
        unique:true,
    },

    descrizione: {
        type: String,
    },

    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La categoria è obbligatoria'],
    },

    quantità: {
        type:"Number",
        required: true,
        default: 0
    },

    ubicazione: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },

    dataIngresso: {
        type: Date,
        requred: true,
        default: Date.now
    },

    vettore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vector'
    },

    inMagazzino: {
        type: 'Boolean',
        required: true,
        default: false
    },

    segnalazione: {
        type: "String",
        default: null
    }
})

module.exports = mongoose.model('Product', productSchema)