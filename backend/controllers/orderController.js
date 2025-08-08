// import dello schema ordine
const Order = require('../models/orderModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productModel');

exports.getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find()
            .populate('cliente')
            .populate('prodotto');
        console.log(orders)
        res.status(200).json(orders);
    } catch (error) {
        console.log('Errore nel recupero degli ordini:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

exports.getOrder = async (req, res) => {
    const { orderId } = req.params;
    console.log(orderId)
    try{
        const orders = await Order.findById( orderId );

        if(!orders) {
            return res.status(404).json({ message: 'Ordine non trovato'});
        }
    } catch (error) {
        console.error("Errore nel recupero degll' ordine:", error);
        res.status(500).json({ message: 'Errore del server'});
    }
};

exports.deleteOrder = async (req, res) => {
    const {id} = req.params.orderId;

    try{
        const orders = await Order.findByIdAndDelete(id);

        if(!orders) {
            return res.status(404).json({ message: 'Ordine non trovato'});
        }
    } catch (error) {
        console.error("Errore nell'eliminazione dell'ordine:", error);
        res.status(500).json({ message: 'Errore del server'});
    }
}

