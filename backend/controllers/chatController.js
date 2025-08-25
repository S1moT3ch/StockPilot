// import dello schema utente
const User = require('../models/userModel');

//recupero di tutti gli utenti
exports.chat = async (req,res) => {
    try{
        const users = await User.find()
        res.status(200).json( users );
    }  catch (error) {
        console.log('Errore nel recupero della lista utenti', error)
    }
}