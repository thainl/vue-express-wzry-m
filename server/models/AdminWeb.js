const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: { type: String },
    path: { type: String },
    menu: { type: mongoose.SchemaTypes.ObjectId, ref: 'Menu' },
    rights: [{
        type: String,
        validate: {
            validator: function (val) {
                return ["GET", "POST", "PUT", "DELETE", "SEARCH"].indexOf(val) !== -1;
            },
            message: 'web right is wrong'
        },
    }],
    description: { type: String },
})

module.exports = mongoose.model('AdminWeb', schema);