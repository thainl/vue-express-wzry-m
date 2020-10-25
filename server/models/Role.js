const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    rights: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ServerRight'
    }]
})

module.exports = mongoose.model('Role', schema);