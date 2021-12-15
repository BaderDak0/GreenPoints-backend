const { Schema, model } = require('mongoose');

const activitesSchema = new Schema({
    imgUrl: { type: String, required: true },
    dateTime: { type: String, required: true },
    recycleBinID: { type: String, required: true },
    items:[ { itemId: String, quantity: Number } ]
});

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    registerDate: { type: String, required: true },
    score: { type: Number, required: true },
    moderator: { type: Boolean, required: true },
    activites:[activitesSchema]
}, { collection: 'users' });
const User = model('User', userSchema);
module.exports = User;