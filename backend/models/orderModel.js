//import della libreria mongoose
const mongoose = require('mongoose');

//schemaType per gli ordini
const orderSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    prodotto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    quantita: {
        type: Number,
        required: true
    },

    data: {
        type: Date,
        default : Date.now,
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema)