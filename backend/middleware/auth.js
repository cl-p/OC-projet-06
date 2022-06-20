const jwt = require('jsonwebtoken');



// on va créer le middleware qui protégera les routes sélectionnées et vérifiera que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.
module.exports = (req, res, next) => {
    // utilisation de try car de nombreux problèmes peuvent se produire
  try {
    // on va extraire le token du header authorization (mot clé Bearer ?)
    // split va récupérer tout après l'espace dans le header
    const token = req.headers.authorization.split(' ')[1];
    // fonction verify permet de décoder le token
    // comparaison entre le token extrait et celui qui a été créer dans le login
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    // on crée la propriété "auth" sur la requête de type objet (qui contient la propriété userId)
    req.auth = {
      userId: userId
    }

    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    console.log('catch')
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};