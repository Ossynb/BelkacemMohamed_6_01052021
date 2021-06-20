const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; // On extrait le token du header Authorization de la requête entrante, on utilise la fonction split pour récuperer tout après l'espace dans le header.
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // On utilise ensuite la fonction verify pour decoder notre token, si celui-ci n'est pas valide , une erreur sera généré
        const userId = decodedToken.userId; // On extrait l'ID utilisateur  de notre token
        if(req.body.userId && req.body.userId !== userId){  // si la demande contient un ID utilisateur, on le compare à celui extrait du token. S'ils sont différents, nous générons une erreur ;
            throw 'User ID non valable'
        } else{  // dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next()
            next();
        }
    } catch (error){
        res.status(401).json({ error : error | 'Requête non authentifiée !'});
    }
}