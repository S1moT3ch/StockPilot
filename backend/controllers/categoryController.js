// import dello schema categoria
const Category = require('../models/categoryModel');


exports.getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find()
        res.status(200).json(categories);
    } catch (error) {
        console.log('Errore nel recupero delle categorie:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};