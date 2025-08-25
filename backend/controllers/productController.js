// import dello schema prodotto e di quelli annidati categoria, locazione e vettore
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Location = require('../models/locationModel');
const Vector = require('../models/vectorModel');
const {populate} = require("dotenv");

//recupero di tutti i prodotti
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

//recupero di uno specifico prodotto
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

//eliminazione di un prodotto
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

//aggiunta di un prodotto
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

        //si trova il nuovo prodotto inserito e si espande il campo categoria
        const populatedProduct = await Product.findById(newProduct._id).populate('categoria');
        //viene restituito il nuovo prodotto
        res.status(201).json({ populatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nella creazione del prodotto:', error});
    }
}

//aggiornamento della locazione di un determinato prodotto
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

//aggiornamento quantità di un certo prodotto, quando ne viene fatto un ordine
exports.updateOrderProductAmount = async (req,res) => {
    const { productId } = req.params;
    const { quantita } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(productId, {
            $inc: {quantità: -quantita}, //si riduce la quantità del valore ordinato
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

//aggiornamento quantità di un certo prodotto, quando esso giunge tramite una consegna
exports.updateDeliveryProductAmount = async (req,res) => {
    const { productId } = req.params;
    const { quantita } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(productId, {
            $inc: {quantità: quantita}, //si aumenta la quantità del valore giunto
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

//aggiunta segnalazione ad un prodotto
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

