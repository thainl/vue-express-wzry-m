const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    path: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    methods: [{
        type: String,
        validate: {
            validator: function (val) {
                return ["GET", "POST", "PUT", "DELETE"].indexOf(val) !== -1;
            },
            message: 'api method is wrong'
        },
    }],
    description: { type: String },
})

module.exports = mongoose.model('ApiRight', schema);