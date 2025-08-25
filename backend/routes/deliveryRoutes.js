//import dipendenze e moduli necessari
const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const  { verifyAccessToken } = require('../middlewares/authMiddleware');

//ottenimento di tutte le consegne
router.get('/all', verifyAccessToken, deliveryController.getAllDeliveries);

//ottenimento di una singola consegna
router.get('/:deliveryId', verifyAccessToken, deliveryController.getDelivery);

//ingresso (eliminazione) di una consegna
router.delete('/:deliveryId', verifyAccessToken, deliveryController.deleteDelivery);

module.exports = router;