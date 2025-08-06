const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const  { verifyAccessToken } = require('../middlewares/authMiddleware');

//registrazione utente
router.post('/register', authController.registerUser);

//login utente
router.post('/login', authController.loginUser);

//verifica autenticazione per frontend
router.get('/check-auth', verifyAccessToken, (req, res) => {
    res.status(200).json({ message: 'Autenticato '});
});

//informazioni utente
router.get('/me', verifyAccessToken, async (req, res) => {
    const user = await User.findById(req.userId).select;
    res.json(user);
});


//refresh del token
router.post('refreshToken', authController.refreshToken);

//logout utente
router.post('/logout', authController.logoutUser);

module.exports = router;