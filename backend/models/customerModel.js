//import della libreria mongoose
const mongoose = require('mongoose');

//schemaType per i clienti
const customerSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Il nome è obbligatorio'],
        unique:true,
    },

    cognome: {
        type: String,
        required: [true, 'Il cognome è obbligatorio'],
        unique:true,
    },

    città: {
        type: String,
        required: [true, 'La città è obbligatorio'],
    },

    indirizzo: {
        type: String,
        required: [true, "L'indirizzo è obbligatorio"],
        unique:true,
    },
})

module.exports = mongoose.model('Customer', customerSchema)