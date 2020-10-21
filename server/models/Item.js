const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String
    },
    itemId: { type: Number },
    icon: {
        type: String
    },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    price: { type: Number }, // 售价
    totalPrice: { type: Number }, // 总价
    effect: { type: String }, // 功效
    description: { type: String },
});

module.exports = mongoose.model('Item', schema);