const express = require('express');
const saucesRoutes = require('./router/route_sauces')

const app = express();

// mongoose est un module pour se connecter à une instance (là où est hébergé ma bdd) mongoDB
const mongoose = require('mongoose');
const Sauces = require('./models/sauces');

// si la req http reçue commence par cette URL (après le domaine), le routeur s'occupe de trier ce qui vient après api/sauces
app.use('/api/sauces', saucesRoutes)

mongoose.connect('mongodb+srv://clementine:Chouquette21@testcoursoc.4dqoggy.mongodb.net/?retryWrites=true&w=majority', 
{ useNewUrlParser: true,
  useUnifiedTopology: true 
}).then( () => {
  console.log("Tout est bon")
}).catch( (err) => {
  console.log(err)
} )

// Ci-dessous, le code pour les CORS
// ces headers permettent d'accéder à notre API depuis n'importe quelle origine 
// ils permettent aussi d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
// et aussi de d'envoyer des requêtes avec les méthodes mentionnées 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(express.json());



module.exports = app;