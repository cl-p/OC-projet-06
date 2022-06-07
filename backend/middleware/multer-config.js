const multer = require('multer');


const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// méthode diskStorage configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
    // destination indique à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // filename indique à multer d'utiliser le nom d'origine et d'ajouter un TimeStamp "date.nom" comme nom de fichier
  filename: (req, file, callback) => {
      // on veut éliminer les espaces et en mettant des "_" à la place 
    const name = file.originalname.split(' ').join('_');
    // créer const dictionnaire de type "mime" pour accepter seulement les extensions qui sont dans la  const MIME_TYPES
    const extension = MIME_TYPES[file.mimetype];
    // date.now() ajoute la date de l'ajout au nom du fichier
    callback(null, name + Date.now() + '.' + extension);
  }
});

// la méthode single crée un middleware qui capture les fichiers d'un certain type, et les enregistre au système de fichiers du serveur à l'aide du storage configuré
module.exports = multer({storage: storage}).single('image');