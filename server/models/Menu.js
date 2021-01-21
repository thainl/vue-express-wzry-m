const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    name: { type: String },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: "Menu" },
    icon: { type: String },
    isShow: { type: Boolean },
    description: { type: String },
    isDeleted: { type: Boolean },
});

schema.virtual("page", {
    localField: "_id",
    ref: "AdminWeb",
    foreignField: "menu",
    justOne: true,
});

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("Menu", schema);
