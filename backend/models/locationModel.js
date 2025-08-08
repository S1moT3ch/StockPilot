const mongoose = require('mongoose');

//schemaType per le ubicazioni
const locationSchema = new mongoose.Schema({
    corridio: {
        type: String,
        required: [true, 'Il corridio è obbligatorio'],
        unique:true,
    },

    scaffale: {
        type: Number,
        required: [true, 'Lo scaffale è obbligatorio'],
        unique:true,
    },

    mensola: {
        type: Number,
        required: [true, 'La mensola è obbligatorio'],
        unique:true,
    }
})

module.exports = mongoose.model('Location', locationSchema);