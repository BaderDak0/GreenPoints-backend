const { Schema, model } = require('mongoose');

const couponSchema = new Schema({
    name: { type: String, required: true },
    info: { type: String, required: true },
    code: { type: String, required: true },
    imgUrl: { type: String, required: true },
    cost: { type: Number, required: true }
}, { collection: 'coupons' });
const Coupon = model('Coupon', couponSchema);
module.exports = Coupon;
