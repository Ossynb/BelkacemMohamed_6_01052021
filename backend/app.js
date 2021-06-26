const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


mongoose.connect('mongodb+srv://OCuser:OoO44UeuTzw2t9TC@clusteroc.uuh69.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',   // Connexion de notre API à notre cluster mongodb
  { useNewUrlParser: true,
    useCreateIndex : true, // ajout pour regler le prob DeprecationWarning : collection.ensureIndex is deprecated.
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(helmet()); //Module qui aide à protéger de certaines vulnérabilités  en configurant de manière appropriée des en-têtes HTTP.(csp, hidePoweredBy, hsts, nocache, nosniff frameguard)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));// cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images .

app.use('/', sauceRoutes);
app.use('/api/auth', userRoutes);

app.get((req, res) => {
  res.json({ message: 'Votre requête a bien été reçue !' }); 
});


module.exports = app;
