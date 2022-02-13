const { Schema, model } = require('mongoose');

const activitesSchema = new Schema({
    dateTime: { type: String, required: true },
    recycleBinID: { type: String, required: true },
    type: { type: String, required: true },
    points: { type: Number, required: true },
});

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    registerDate: { type: String, required: true },
    points: { type: Number, required: true },
    moderator: { type: Boolean, required: true },
    activities:[activitesSchema]
}, { collection: 'users' });
const User = model('User', userSchema);
module.exports = User;
