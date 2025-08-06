const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//registrazione utente
router.post('/register', authController.registerUser);

//login utente
router.post('/login', authController.loginUser);

//refresh del token
router.post('refreshToken', authController.refreshToken);

//logout utente
router.post('/logout', authController.logoutUser);

module.exports = router;