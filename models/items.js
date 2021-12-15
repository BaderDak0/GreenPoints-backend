const { Schema, model } = require('mongoose');

const itemsSchema = new Schema({
    type: { type: String, required: true },
    size: { type: Number, required: true },
}, { collection: 'items' });
const Item = model('Item', itemsSchema);
module.exports = Item;