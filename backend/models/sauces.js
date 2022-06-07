const mongoose = require('mongoose');


const saucesSchema = mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String, required: true },
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    mainPepper: {type: String, required: true},
    heat: {type: String, required: true},
    heatValue: {type: Number, required: true},
    likes: {type: String, required: true},
    dislikes: {type: String, required: true},
    userLiked: {type: String, required: true}
}
)

module.exports = mongoose.model('sauces', saucesSchema);