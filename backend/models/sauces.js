const mongoose = require('mongoose');


const saucesSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    mainPepper: {type: String, required: true},
    heat: {type: String, required: true},
    heatValue: {type: Number, required: true}
}
)

module.exports = mongoose.model('sauces', saucesSchema);