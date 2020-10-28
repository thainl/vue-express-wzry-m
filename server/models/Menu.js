const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: { type: String },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Menu' },
    icon: { type: String },
    isShow: { type: Boolean},
    description: { type: String },
})

schema.virtual('page', {
    localField: '_id',
    ref: 'AdminWeb',
    foreignField: 'menu',
    justOne: true
})

module.exports = mongoose.model('Menu', schema);