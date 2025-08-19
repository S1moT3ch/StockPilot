// import dello schema prodotto
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Location = require('../models/locationModel');
const Vector = require('../models/vectorModel');
const {populate} = require("dotenv");

exports.getAllProducts = async (req, res) => {
    try{
        const products = await Product.find()
            .populate('categoria')
            .populate('ubicazione')
            .populate('vettore');
        res.status(200).json(products);
    } catch (error) {
        console.log('Errore nel recupero dei prodotti:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

exports.getProduct = async (req, res) => {
    const { productId } = req.params;
    try{
        const product = await Product.findById( productId )
            .populate('categoria')
            .populate('ubicazione')
            .populate('vettore');
        res.status(200).json(product);
        if(!product) {
            return res.status(404).json({ message: 'Prodotto non trovato'});
        }
    } catch (error) {
        console.error("Errore nel recupero del prodotto:", error);
        res.status(500).json({ message: 'Errore del server'});
    }
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try{
        const product = await Product.findByIdAndDelete( productId );
        res.status(200).json({ message:"Prodotto eliminato" });
        if(!product) {
            return res.status(404).json({ message: 'Prodotto non trovato'});
        }
    } catch (error) {
        console.error("Errore nell'eliminazione del prodotto:", error);
        res.status(500).json({ message: 'Errore del server'});
    }
}

exports.addProduct = async (req,res) => {
    const { id } = req.params;
    const { nome, descrizione, categoria, quantità, ubicazione, dataIngresso, vettore, inMagazzino, segnalazione } = req.body;
    try {
        const newProduct = await Product.create({
            nome,
            descrizione,
            categoria,
            quantità,
            ubicazione,
            dataIngresso,
            vettore,
            inMagazzino,
            segnalazione
        });

        const populatedProduct = await Product.findById(newProduct._id).populate('categoria');
        res.status(201).json({ populatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nella creazione del prodotto:', error});
    }
}

exports.updateProductLocation = async (req,res) => {
    const { productId } = req.params;
    const { locationId } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(productId, {
            ubicazione: locationId,
            inMagazzino: true
        }, {new: true});
        return res.status(200).json(product);
        if(!product) {
            return res.status(404).json({ message: 'Prodotto non trovato'});
        }
    } catch (error) {
        console.error("Errore nell'update dell'ubicazione del prodotto:", error);
    }
}

exports.updateOrderProductAmount = async (req,res) => {
    const { productId } = req.params;
    const { quantita } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(productId, {
            $inc: {quantità: -quantita},
            inMagazzino: true
        }, {new: true});
        return res.status(200).json(product);
        if(!product) {
            return res.status(404).json({ message: 'Prodotto non trovato'});
        }
    } catch (error) {
        console.error("Errore nell'update della quantità del prodotto:", error);
    }
}

exports.updateDeliveryProductAmount = async (req,res) => {
    const { productId } = req.params;
    const { quantita } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(productId, {
            $inc: {quantità: quantita},
            inMagazzino: true
        }, {new: true});
        return res.status(200).json(product);
        if(!product) {
            return res.status(404).json({ message: 'Prodotto non trovato'});
        }
    } catch (error) {
        console.error("Errore nell'update della quantità del prodotto:", error);
    }
}

exports.addWarning = async (req,res) => {
    const {productId, segnalazione} = req.body;

    if (!productId || !segnalazione) {
        return res.status(400).json({message: 'Dati mancanti: productId o segnalazione'});
    }

    try {
        const product = await Product.findByIdAndUpdate(productId, {
            segnalazione: segnalazione
        }, {new: true});
        return res.status(200).json({ product });
        if (!product) {
            return res.status(404).json({message: 'Prodotto non trovato'});
        }

        return res.status(200).json({message: 'Segnalazione aggiunta con successo'});
    } catch (error) {
        console.error("Errore nell'aggiunta della segnalazione:", error);
        return res.status(500).json({message: 'Errore del server'});
    }

}

