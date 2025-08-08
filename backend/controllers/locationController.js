// import dello schema locazione
const Location = require('../models/locationModel');
const {populate} = require("dotenv");

exports.getAllLocations = async (req, res) => {
    try{
        const locations = await Location.find()
        res.status(200).json(locations);
    } catch (error) {
        console.log('Errore nel recupero delle ubicazioni:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

