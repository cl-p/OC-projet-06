const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const saucesCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config')

// localhost:3000/api/sauces
// le routeur ne vérifie que ce qui vient après /api/sauces

router.get('/', auth ,saucesCtrl.getAllSauces);
router.post('/', auth ,multer ,saucesCtrl.createSauces);
router.get('/:id', auth ,saucesCtrl.getOneSauce);
router.delete('/:id', auth ,saucesCtrl.deleteSauce);



module.exports = router;