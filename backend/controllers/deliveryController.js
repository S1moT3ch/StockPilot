// import dello schema consegne
const Delivery = require('../models/deliveryModel');
const Vector = require('../models/vectorModel');
const Product = require('../models/productModel');
const {populate} = require("dotenv");

exports.getAllDeliveries = async (req, res) => {
    try{
        const deliveries = await Delivery.find()
            .populate('vettore')
            .populate({
                path: 'prodotto',
                populate: [
                    { path: 'categoria' },
                    { path: 'ubicazione' }
                ]
            });
        res.status(200).json(deliveries);
    } catch (error) {
        console.log('Errore nel recupero delle consegne:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

exports.getDelivery = async (req, res) => {
    const { deliveryId } = req.params;
    try{
        const delivery = await Delivery.findById( deliveryId )
            .populate('vettore')
            .populate({
                path: 'prodotto',
                populate: [
                    { path: 'categoria' },
                    { path: 'ubicazione' }
                ]
            })
        res.status(200).json(delivery);
        if(!delivery) {
            return res.status(404).json({ message: 'Ordine non trovato'});
        }
    } catch (error) {
        console.error("Errore nel recupero degll' ordine:", error);
        res.status(500).json({ message: 'Errore del server'});
    }
};

exports.deleteDelivery = async (req, res) => {
    const { deliveryId } = req.params;
    try{
        const delivery = await Delivery.findByIdAndDelete( deliveryId );
        if(!delivery) {
            return res.status(404).json({ message: 'Ordine non trovato'});
        }
        res.status(200).json({ message:"Ordine eliminato" });
    } catch (error) {
        console.error("Errore nell'eliminazione dell'ordine:", error);
        res.status(500).json({ message: 'Errore del server'});
    }
}

