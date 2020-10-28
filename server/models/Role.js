const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    rights: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ServerRight'
    }],
    adminWebs: [{
        web: { type: mongoose.SchemaTypes.ObjectId, ref: 'AdminWeb' },
        rights: [{ type: String }]
    }],
    apiRights: [{
        url: { type: mongoose.SchemaTypes.ObjectId, ref: 'ApiRight' },
        rights: [{ type: String }]
    }]
})

module.exports = mongoose.model('Role', schema);