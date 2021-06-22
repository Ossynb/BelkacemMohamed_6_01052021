const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre,
                                                              //  nous installerons un package de validation pour pré-valider les informations avant de les enregistrer 

                                                              
const userSchema = mongoose.Schema({ // creation du schema utilisateur
    userId: {type : String},
    email: { type: String, required: true, unique: true }, // Pour s'assurer que deux utilisateurs ne peuvent pas utiliser la même adresse e-mail, 
    password:{ type: String, required: true}               // nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);