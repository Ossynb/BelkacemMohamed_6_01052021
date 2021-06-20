const Sauce = require('../models/sauce');
const fs = require('fs');
const User = require('../models/User');
const sauce = require('../models/sauce');

exports.likeSauce = (req, res) => {
    console.log( req.params.id);
    let query = sauce.find(null);
    query.where ('_id',req.params.id);     
    query.exec(function(err, data){
        if (err) {
            throw err
        } 

        let sauceObject = {
            userId: req.body.userId,
            usersLiked : data[0].usersLiked,
            usersDisliked :data[0].usersDisliked,
        };

        switch (req.body.like) {
            case 1:
                sauceObject.likes = data[0].likes +1 ;
                sauceObject.usersLiked.push(req.body.userId);
                console.log(sauceObject.usersLiked);  
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject , _id: req.params.id})
                .then(() => res.status(200).json({ message: 'sauce liké par l\'utilisateur !'}))
                .catch(error => res.status(400).json({error}));      
                break;
                
            case -1:
                sauceObject.dislikes = data[0].dislikes +1 ;
                sauceObject.usersDisliked.push(req.body.userId);
                console.log(sauceObject.usersDisliked);   
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject , _id: req.params.id})
                .then(() => res.status(200).json({ message: 'sauce disliké par l\'utilisateur !'}))
                .catch(error => res.status(400).json({error})); 
                break; 
    
            case 0:
                if((sauceObject.usersLiked).includes(req.body.userId)) {
                    sauceObject.likes = data[0].likes-1 ;
                    sauceObject.dislikes = data[0].dislikes ;
                    console.log(sauceObject.likes);
                    sauceObject.usersLiked.remove(req.body.userId); 
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject , _id: req.params.id})
                    .then(() => res.status(200).json({ message: ' like annulé par l\'utilisateur !'}))
                    .catch(error => res.status(400).json({error}));  
                }

                if((sauceObject.usersDisliked).includes(req.body.userId)){
                    sauceObject.likes = data[0].likes ;
                    sauceObject.dislikes = data[0].dislikes-1 ;
                    console.log(sauceObject.dislikes);
                    sauceObject.usersDisliked.remove(req.body.userId); 
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject , _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'dislike annulé par l\'utilisateur !'}))
                    .catch(error => res.status(400).json({error}));  
                }
            
            default:
                break;
        }         
        console.log(sauceObject);
    }); 
}

exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauceObject = JSON.parse((req.body.sauce))
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes :0,
        usersLiked : [],
        usersDisliked :[],
    });
    console.log(sauceObject);
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce ajoutée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({ _id:req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message : 'Sauce supprimée !'}))
                    .catch(error => res.statut(400).json({ error}));
            });
        })
        .catch(error => res.status(500).json({ error}));
    
};

