//import dipendenze e moduli necessari
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const  { verifyAccessToken } = require('../middlewares/authMiddleware');

//ottenimento di tutte le categorie
router.get('/all', verifyAccessToken, categoryController.getAllCategories);

module.exports = router;