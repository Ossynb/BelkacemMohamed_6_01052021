
const User = require('../models/User'); //Récupération du model User
const jwt = require('jsonwebtoken'); // module de cryptage de mot de passe
const bcrypt =require('bcrypt'); // module d'authentification


exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {            //hashage du mot de passe
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()             // on enregistre le user ds la base de donnée
    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
    .catch(error => res.status(400).json({ error }));
  })
    .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          const tokenSecret = jwt.sign(    //fonction sign pour encoder un nouveau token
            { userId: user._id },           // Ce token contient l'ID de l'utilisateur
            'RANDOM_TOKEN_SECRET',          // chaine secrète pour encoder notre token
            { expiresIn: '24h' }            // On definit la durée de validité du token à 24h
          );
          res.status(200).json({            //Nous renvoyons le token au front-end avec notre réponse
            userId: user._id,
            token :tokenSecret
          });

        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};