// import dello schema ordine e di quelli annidati cliente, prodotto, categoria e locazione
const Order = require('../models/orderModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Location = require('../models/locationModel');
const {populate} = require("dotenv");

//recupero di tutti gli ordini
exports.getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find()
            .populate('cliente')
            .populate('prodotto');
        res.status(200).json(orders);
    } catch (error) {
        console.log('Errore nel recupero degli ordini:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

//recupero di uno specifico ordine
exports.getOrder = async (req, res) => {
    const { orderId } = req.params;
    try{
        const order = await Order.findById( orderId )
            .populate('cliente')
            .populate({
                path: 'prodotto',
                populate: [
                    { path: 'categoria' },
                    { path: 'ubicazione' }
                ]
            })
        res.status(200).json(order);
        if(!order) {
            return res.status(404).json({ message: 'Ordine non trovato'});
        }
    } catch (error) {
        console.error("Errore nel recupero degll' ordine:", error);
        res.status(500).json({ message: 'Errore del server'});
    }
};

//eliminazione di un ordine
exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;
    console.log(orderId);
    try{
        const orders = await Order.findByIdAndDelete( orderId );
        res.status(200).json({ message:"Ordine eliminato" });
        if(!orders) {
            return res.status(404).json({ message: 'Ordine non trovato'});
        }
    } catch (error) {
        console.error("Errore nell'eliminazione dell'ordine:", error);
        res.status(500).json({ message: 'Errore del server'});
    }
}

