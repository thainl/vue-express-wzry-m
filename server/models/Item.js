const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    itemId: { type: Number },
    icon: {
        type: String,
    },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    price: { type: Number }, // 售价
    totalPrice: { type: Number }, // 总价
    effect: { type: String }, // 功效
    description: { type: String },
    isDeleted: { type: Boolean },
});

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("Item", schema);
