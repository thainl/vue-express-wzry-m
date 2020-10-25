const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    path: { type: String },
    description: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }
});

module.exports = mongoose.model("ApiUrl", schema);
