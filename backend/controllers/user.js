
const User = require('../models/User'); //Récupération du model User
const jwt = require('jsonwebtoken'); // module de cryptage de mot de passe
const bcrypt =require('bcrypt'); // module d'authentification


exports.signup = (req, res, next) => { 
  bcrypt.hash(req.body.password, 10) //nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. 
  .then(hash => {                    //Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé.
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
    User.findOne({ email: req.body.email }) //nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données :
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) //la fonction compare() du package bcrypt permet d'indiquer si les deux hash ont été générés à l'aide d'un même mot de passe initial. 
        .then(valid => {                               //Il nous aidera donc à implémenter correctement le stockage et la vérification sécurisés des mots de passe.
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          const tokenSecret = jwt.sign(    //fonction sign pour encoder un nouveau token
            { userId: user._id },           // Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) 
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