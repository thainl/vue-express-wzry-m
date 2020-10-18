const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String
    },
    icon: {
        type: String
    },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    grade: { type: Number }, // 铭文等级
    effect: { type: String }, // 功效
});

module.exports = mongoose.model('Ming', schema);