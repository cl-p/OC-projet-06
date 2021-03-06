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

    // on récupère l'id qui a été créé précédemment dans le middleware
    userId: req.auth.userId,

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
      console.log(error)
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
        console.log(error)
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
        
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          console.log(err)
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};
   

  
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => 
        res.status(200).json({ message: 'Objet modifié !'})
      )
      .catch(error => 
        res.status(400).json({ error })
      );
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


  exports.likeOrDislike = (req, res, next) => {
    // mettre en place la possibilité pour l'utilisateur de mettre un like ou un dislike sur une sauce
    // si l'utilisateur clique sur like, ajoute +1 au nb de like et idem pour dislike
    // a chaque click sur like/dislike, l'id de l'utilisateur qui a donné son avis est stocké dans un tableau
    // si utilisateur reclick, son id sera supprimé du tableau 
    // l'utilisateur ne peut mettre qu'une seule valeur pour chaque sauce 
    // mise à jour du total like et dislike à chaque click sur l'îcone 

    // d'abord il faut récupérer la sauce 
    // récuperer id user 

    Sauces.findOne({ _id: req.params.id }).then(
      (s) => {
        let nblike = req.body.like
        if (nblike === 1){

          like(s, req.auth.userId);
        }
        else if(nblike === -1 ){

          dislike(s, req.auth.userId);
        }
        else {
          removeVote(s, req.auth.userId)
        }
        
        // .save permet de mettre à jour la sauce 
        s.save().then(() => 
          res.status(200).json({ message: 'Objet modifié !'})
        )
        .catch(error => { 
          console.log(error);
          res.status(500).json({ error })
        })
      }).catch(error => {
        console.log(error)
        res.status(404).json({
          error: error
        });
      })
  };


  // fonction permettant d'ajouter l'id de l'utilisateur et d'incrémenter le nombre de likes
  function like(sauce, idUserWhoVoted){
    let i = sauce.usersLiked.findIndex((e)=> e === idUserWhoVoted)
    if(i === -1){
      sauce.usersLiked.push(idUserWhoVoted)
      sauce.likes = sauce.likes + 1
    }
  }


  // fonction permettant d'ajouter l'id de l'utilisateur et d'incrémenter le nombre de dislikes
  function dislike(sauce, idUserWhoVoted){
    let i = sauce.usersDisliked.findIndex((e)=> e === idUserWhoVoted)
    if(i === -1){
      sauce.usersDisliked.push(idUserWhoVoted)
      sauce.dislikes = sauce.dislikes + 1
    }
        
  }
  
  // fonction permettant de d'enlever l'id de l'utilisateur dès qu'il retire son vote, et de décrémenter like ou dislike
  function removeVote(sauce, idUserWhoVoted){
    let i = sauce.usersLiked.findIndex((e)=> e === idUserWhoVoted)
    if(i != -1){
      sauce.usersLiked.splice(i, 1 )
      sauce.likes = sauce.likes - 1
    }

    i = sauce.usersDisliked.findIndex((e)=> e === idUserWhoVoted)
    if(i != -1){
      sauce.usersDisliked.splice(i, 1 )
      sauce.dislikes = sauce.dislikes - 1
    }
    
  }