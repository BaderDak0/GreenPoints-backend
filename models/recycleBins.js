const { Schema, model } = require('mongoose');

const addressSchema = new Schema({
   lat : {type:Number},
   lng : {type:Number}
});

const recycleBinsSchema = new Schema({
    type: { type: String, required: true },
    location:addressSchema,
    maxCapacity: { type: Number, required: true },
    currentCapacity: { type: Number, required: true },
}, { collection: 'recycleBins' });

recycleBinsSchema
    .path('type')
    .set(type => String(type).toLowerCase());

const RecycleBin = model('RecycleBin', recycleBinsSchema);
module.exports = RecycleBin;