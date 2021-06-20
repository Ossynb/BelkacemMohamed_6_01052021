const express = require('express');
const router = express.Router();

const auth = require ('../middleware/auth');
const multer = require ('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');


router.post('/api/sauces', multer, sauceCtrl.createSauce); //route pour la création d'une sauce
router.post('/api/sauces/:id/like', auth, multer, sauceCtrl.likeSauce); // route pour le like ou dislike d'une sauce
router.put('/api/sauces/:id', auth, multer, sauceCtrl.modifySauce);// route pour modifier une sauce
router.get('/api/sauces/:id', auth, sauceCtrl.getOneSauce);// route pour sélectionner une sauce
router.get('/api/sauces', auth, sauceCtrl.getAllSauce);// route pour sélectionner toute les sauces
router.delete('/api/sauces/:id', sauceCtrl.deleteSauce);// route pour supprimer une sauce


module.exports = router;