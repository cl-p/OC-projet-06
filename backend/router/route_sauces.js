const express = require('express')
const router = express.Router()
const saucesCtrl = require('../controllers/sauces');

// localhost:3000/api/sauces
// le routeur ne vérifie que ce qui vient après /api/sauces

router.get('/', saucesCtrl.getAllSauces);
router.post('/', saucesCtrl.createSauces);
router.get('/:id', saucesCtrl.getOneSauce);
router.put('/:id', saucesCtrl.modifySauce);
router.delete('/:id', saucesCtrl.deleteSauce);



module.exports = router;