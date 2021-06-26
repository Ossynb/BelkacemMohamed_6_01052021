const Sauce = require('../models/sauce');
const fs = require('fs'); //fs signifie « file system » (soit « système de fichiers » en français). Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const User = require('../models/User');
const sauce = require('../models/sauce');




exports.getAllSauce = (req, res, next) => {
    Sauce.find() //nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant toutes les sauces dans notre base de données. 
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //nous utilisons la méthode findOne() dans notre modèle sauce pour trouver la sauce unique ayant le même _id que le paramètre de la requête ;
      .then(sauce => res.status(200).json(sauce)) //cette sauce est ensuite retourné dans une Promise et envoyé au front-end ;
      .catch(error => res.status(404).json({ error }));
};


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse((req.body.sauce)) // analyse une chaîne de caractères JSON et construit la valeur JavaScript 
    const sauce = new Sauce({ // on créer une nouvelle instance sauce
        ...sauceObject,   // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body .
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //req.protocol pour obtenir le premier segment, req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' )
        likes : 0,
        dislikes :0,
        usersLiked : [],
        usersDisliked :[],
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce ajoutée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. 
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})    //on met à jour la base donnée avec updateOne() 1er argument:l'objet à modifier, 2eme argument : nouvel objet
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({ _id:req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {    //nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message : 'Sauce supprimée !'}))
                    .catch(error => res.statut(400).json({ error}));
            });
        })
        .catch(error => res.status(500).json({ error}));
    
};

exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    case 1:
      Sauce.updateOne(
        { _id: req.params.id },
        { 
          $push: {usersLiked: req.body.userId},
          $inc: {likes: +1}, 
        }
      )
      .then(() => res.status(200).json({message: ' sauce liké par l\'utilisateur !'}))
      .catch((error) => res.status(400).json({error}))
      break;
    
    case -1:
      Sauce.updateOne( 
        { _id: req.params.id},
        { 
          $push: {usersDisliked: req.body.userId},
          $inc: {dislikes: +1}, 
        }
      )
      .then(() => {res.status(200).json({message: 'sauce disliké par l\'utilisateur !'})})
      .catch((error) => res.status(400).json({error}))
      break;
    
    case 0:
      Sauce.findOne({ _id: req.params.id})
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) { 
          Sauce.updateOne(
            { _id: req.params.id},
            {
              $pull: {usersLiked: req.body.userId},
              $inc: {likes: -1}, 
            }
          )
          .then(() => res.status(200).json({message: 'Like annulé par l\'utilisateur  !'}))
          .catch((error) => res.status(400).json({error}))
        }

        if (sauce.usersDisliked.includes(req.body.userId)) { 
          Sauce.updateOne(
            { _id: req.params.id},
            {
              $pull: {usersDisliked: req.body.userId},
              $inc: {dislikes: -1},
            }
          )
          .then(() => res.status(200).json({message: 'Dislike annulé par l\'utilisateur !'}))
          .catch((error) => res.status(400).json({error}))
        }

      })
      .catch((error) => res.status(404).json({error}))
      
    default:
      break;
  }
}       
