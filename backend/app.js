const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


mongoose.connect('mongodb+srv://OCuser:OoO44UeuTzw2t9TC@clusteroc.uuh69.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(helmet()); //Module qui aide à protéger de certaines vulnérabilités  en configurant de manière appropriée des en-têtes HTTP.(csp, hidePoweredBy, hsts, nocache, nosniff frameguard)
/* csp, définit l’en-tête Content-Security-Policy pour la protection contre les attaques de type cross-site scripting et autres injections intersites.
hidePoweredBy, supprime l’en-tête X-Powered-By.
hsts, définit l’en-tête Strict-Transport-Security qui impose des connexions (HTTP sur SSL/TLS) sécurisées au serveur.
ieNoOpen, définit X-Download-Options pour IE8+.
noCache, définit des en-têtes Cache-Control et Pragma pour désactiver la mise en cache côté client.
noSniff, définit X-Content-Type-Options pour protéger les navigateurs du reniflage du code MIME d’une réponse à partir du type de contenu déclaré.
frameguard, définit l’en-tête X-Frame-Options pour fournir une protection clickjacking.
xssFilter, définit X-XSS-Protection afin d’activer le filtre de script intersites (XSS) dans les navigateurs Web les plus récents.
*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/', sauceRoutes);
app.use('/api/auth', userRoutes);

app.get((req, res) => {
  res.json({ message: 'Votre requête a bien été reçue !' }); 
});


module.exports = app;
