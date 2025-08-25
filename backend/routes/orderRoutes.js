//import dipendenze e moduli necessari
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const  { verifyAccessToken } = require('../middlewares/authMiddleware');

//ottenimento di tutti gli ordini
router.get('/all', verifyAccessToken, orderController.getAllOrders);

//ottenimento di un singolo ordine
router.get('/:orderId', verifyAccessToken, orderController.getOrder);

//completamento (eliminazione) di un ordine
router.delete('/:orderId', verifyAccessToken, orderController.deleteOrder);

module.exports = router;