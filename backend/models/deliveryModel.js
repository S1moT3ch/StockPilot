//import della libreria mongoose
const mongoose = require('mongoose');

//schemaType per le consegne
const deliverySchema = new mongoose.Schema({
    vettore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vector',
        required: [true, 'Il vettore è obbligatorio']
    },

    prodotto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Il prodotto è obbligatorio']
    },

    quantita: {
        type: Number,
        required: true
    },

    data: {
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = mongoose.model('Delivery', deliverySchema)