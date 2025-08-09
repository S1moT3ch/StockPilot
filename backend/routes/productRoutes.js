const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const  { verifyAccessToken } = require('../middlewares/authMiddleware');

//ottenimento di tutti i prodotti
router.get('/all', verifyAccessToken, productController.getAllProducts);

//ottenimento di un singolo prodotto
router.get('/:productId', verifyAccessToken, productController.getProduct);

//cancellazione di un prodotto
router.delete('/:productId', verifyAccessToken, productController.deleteProduct);

//creazione di un prodotto
router.post('/new', verifyAccessToken, productController.addProduct);

//update dell'ubicazione di un prodotto
router.put('/:productId', verifyAccessToken, productController.updateProductLocation);

//aggiornamento segnalazione di un prodotto
router.post('/segnalazione', verifyAccessToken, productController.addWarning);

module.exports = router;