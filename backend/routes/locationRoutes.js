const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const  { verifyAccessToken } = require('../middlewares/authMiddleware');

//ottenimento di tutte le locazioni
router.get('/all', verifyAccessToken, locationController.getAllLocations);

module.exports = router;