const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// stocker les informations de connexion de l'utilisateur (email + password)
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


// on veut que chaque email soit unique donc on rajoute un package validateur en l'appliquant sur le model userSchema 
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);