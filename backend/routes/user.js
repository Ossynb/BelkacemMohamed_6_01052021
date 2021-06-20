const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);// route pour ajouter l'utilisateur a la base de données
router.post('/login', userCtrl.login);// route pour la connexion d'un user

module.exports = router;