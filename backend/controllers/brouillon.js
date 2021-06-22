// exports.likeSauce = (req, res) => {
//     console.log( req.params.id);
//     let query = sauce.find(null);
//     query.where ('_id',req.params.id);     // a  recoder avec sweulement find()
//     query.exec(function(err, data){
//         if (err) {
//             throw err
//         } 

//         let sauceObject = {
//             userId: req.body.userId,
//             usersLiked : data[0].usersLiked,
//             usersDisliked :data[0].usersDisliked,
//         };

//         if(req.body.like==1){// utiliser un switch case
//             sauceObject.likes = data[0].likes +1 ; // on incremente likes de +1
//             sauceObject.usersLiked.push(req.body.userId);// on ajoute l'utilisateur dans le tableau userliked
//             
//             Sauce.updateOne({ _id: req.params.id}, { ...sauceObject , _id: req.params.id})
//             .then(() => res.status(200).json({ message: 'sauce liké par l\'utilisateur !'}))
//             .catch(error => res.status(400).json({error}));  
 
//         } 

//         if(req.body.like==(-1)){
//             sauceObject.dislikes = data[0].dislikes +1 ;
//             sauceObject.usersDisliked.push(req.body.userId);
//           
//             Sauce.updateOne({ _id: req.params.id}, { ...sauceObject , _id: req.params.id})
//             .then(() => res.status(200).json({ message: 'sauce disliké par l\'utilisateur !'}))
//             .catch(error => res.status(400).json({error}));  
 
//         } 

//         if ((req.body.like ==0) && ((sauceObject.usersLiked).includes(req.body.userId))) {
//             sauceObject.likes = data[0].likes-1 ;
//             sauceObject.dislikes = data[0].dislikes ;
//     
//             sauceObject.usersLiked.remove(req.body.userId); 
//             Sauce.updateOne({ _id: req.params.id}, { ...sauceObject , _id: req.params.id})
//             .then(() => res.status(200).json({ message: ' like annulé par l\'utilisateur !'}))
//             .catch(error => res.status(400).json({error}));  

//         } 

//         if ((req.body.like ==0) && ((sauceObject.usersDisliked).includes(req.body.userId))){
//             sauceObject.likes = data[0].likes ;
//             sauceObject.dislikes = data[0].dislikes-1 ;
//          
//             sauceObject.usersDisliked.remove(req.body.userId); 
//             Sauce.updateOne({ _id: req.params.id}, { ...sauceObject , _id: req.params.id})
//             .then(() => res.status(200).json({ message: 'dislike annulé par l\'utilisateur !'}))
//             .catch(error => res.status(400).json({error}));  

//         }
        
//         console.log(sauceObject);
        
//     }); 
// }





exports.likeSauce = (req, res, next) => {        
    if (req.body.like === 1) { 
      Sauce.updateOne(
        { _id: req.params.id },
        { 
          $push: {usersLiked: req.body.userId},
          $inc: {likes: +1}, 
        }
      )
      .then(() => res.status(200).json({message: ' sauce liké par l\'utilisateur !'}))
      .catch((error) => res.status(400).json({error}))
  
      
    }

    if (req.body.like === -1) {
      Sauce.updateOne( 
        { _id: req.params.id},
        { 
          $push: {usersDisliked: req.body.userId},
          $inc: {dislikes: +1}, 
        }
      )
      .then(() => {res.status(200).json({message: 'sauce disliké par l\'utilisateur !'})})
      .catch((error) => res.status(400).json({error}))
    }

    if (req.body.like === 0) { 
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
          .then(() => res.status(200).json({message: 'Like annulé !'}))
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
          .then(() => res.status(200).json({message: 'Dislike annulé !'}))
          .catch((error) => res.status(400).json({error}))
        }

      })
      .catch((error) => res.status(404).json({error}))

  }


}
// router.get('/', sauceCtrl.requeteRecue);
// router.use('/api/sauces',  sauceCtrl.reponseEtat);


// exports.reponseConnect = (req, res, next) => {
//     console.log('Requête reçue !');
//     next();
// };

// exports.reponseEtat =  (req, res, next) => {
//     res.status(201);
//     next();
// };

// exports.requeteRecue = (req, res)=>{
//     res.json({message : 'Votre requête a bien été reçue'})
// };

// exports.reponseEnvoiSucces = (req, res, next) => {
//     console.log('Réponse envoyée avec succès !');
// };


