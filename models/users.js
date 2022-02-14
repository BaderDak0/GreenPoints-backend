const { Schema, model } = require('mongoose');

const activitesSchema = new Schema({
    dateTime: { type: String, required: true },
    recycleBinID: { type: String, required: true },
    type: { type: String, required: true },
    points: { type: Number, required: true },
    address: { type: String, required: true },
});


const couponSchema = new Schema({
    name: { type: String, required: true },
    info: { type: String, required: true },
    code: { type: String, required: true },
    imgUrl: { type: String, required: true },
    cost: { type: Number, required: true },
    owned: { type: Boolean, default: true },
});

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    imgUrl: { type: String, required: true },
    password: { type: String, required: true },
    registerDate: { type: String, required: true },
    points: { type: Number, required: true },
    moderator: { type: Boolean, required: true },
    activities: [activitesSchema], 
    coupons: [couponSchema],
}, { collection: 'users' });

userSchema
    .path('email')
    .set(email => String(email).toLowerCase());
    
const User = model('User', userSchema);
module.exports = User;
