//import dipendenze e moduli necessari
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const  { verifyAccessToken } = require('../middlewares/authMiddleware');

//ottenimento di tutti i prodotti
router.get('/all', verifyAccessToken, productController.getAllProducts);

//ottenimento di un singolo prodotto
router.get('/:productId', verifyAccessToken, productController.getProduct);

//eliminazione di un prodotto
router.delete('/:productId', verifyAccessToken, productController.deleteProduct);

//creazione di un prodotto
router.post('/new', verifyAccessToken, productController.addProduct);

//update dell'ubicazione di un prodotto
router.put('/location/:productId', verifyAccessToken, productController.updateProductLocation);

//update della quantità di un prodotto per ordini da evadere
router.put('/order/:productId', verifyAccessToken, productController.updateOrderProductAmount);

//update della quantità di un prodotto per consegne da registrare
router.put('/delivery/:productId', verifyAccessToken, productController.updateDeliveryProductAmount);

//aggiornamento segnalazione di un prodotto
router.post('/segnalazione', verifyAccessToken, productController.addWarning);

module.exports = router;