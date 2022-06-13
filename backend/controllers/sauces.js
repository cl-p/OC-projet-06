const Sauces = require('../models/sauces');
const fs = require('fs')

exports.createSauces = (req, res, next) => {
  // Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject)
  // delete sauceObject._id;
  const sauces = new Sauces({
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    mainPepper: sauceObject.mainPepper,
    heat: sauceObject.heat,
    // pour likes et dislikes on leur met une valeur par defaut 
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],




    // attention à changer car juste valeur test
    userId: '0',






    // req.protocole --> segment http de l'url de l'image
    // req.get('host') --> segment pour ajouter l'hôte du server à l'url de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  console.log(sauces)
  // save renvoie une promesse
  sauces.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};




exports.getOneSauce = (req, res, next) => {
    // findOne renvoie une promesse
    Sauces.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
  


  
  exports.deleteSauce = (req, res, next) => {
    // on récupére la sauce dans la bdd, puis on vérife qu'elle appartient à l'utilisateur
    // si oui, on la supprime   
    // sinon, on retourne une erreur 
    Sauces.findOne({ _id: req.params.id }).then(
      (sauce) => {
        if (!sauce) {
          res.status(404).json({
            error: new Error('Erreur!')
          });
        }
        if (sauce.userId !== req.auth.userId) {
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }
        Sauces.deleteOne({ _id: req.params.id }).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    )
  };

  
  exports.getAllSauces = (req, res, next) => {
      // find renvoie une promesse
    Sauces.find().then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        console.log(error)
        res.status(400).json({
          error: error
        });
      }
    );
  };