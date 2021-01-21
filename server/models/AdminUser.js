const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    name: { type: String },
    password: {
        type: String,
        select: false, // 默认不读取此字段
        set(val) {
            return require("bcrypt").hashSync(val, 10);
        },
    },
    role: { type: mongoose.SchemaTypes.ObjectId, ref: "Role" },
    isDeleted: { type: Boolean },
});

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("AdminUser", schema);
