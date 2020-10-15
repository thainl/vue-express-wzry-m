const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: { type: String },
    password: {
        type: String,
        select: false, // 默认不读取此字段
        set(val) {
            return require("bcrypt").hashSync(val, 10);
        },
    },
});

module.exports = mongoose.model("AdminUser", schema);
