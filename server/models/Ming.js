const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    mingId: { type: Number },
    icon: {
        type: String,
    },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    grade: { type: Number }, // 铭文等级
    effect: { type: String }, // 功效
    isDeleted: { type: Boolean },
});

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("Ming", schema);
