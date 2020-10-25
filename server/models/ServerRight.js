const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    url: { type: mongoose.SchemaTypes.ObjectId, ref: 'ApiUrl' },
    description: { type: String },
    method:{
        type: String,
        validate: {
            validator: function (val) {
                return ["GET", "POST", "PUT", "DELETE"].indexOf(val) !== -1;
            },
            message: 'api method is wrong'
        },
    },
});

module.exports = mongoose.model("ServerRight", schema);
