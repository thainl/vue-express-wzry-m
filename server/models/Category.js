const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    isDeleted: { type: Boolean },
});

schema.virtual("children", {
    // 新建一个虚拟字段children
    localField: "_id", // 要用本地的哪个字段进行关联
    ref: "Category", // 要关联的模型
    foreignField: "parent", // 外键， 表示要关联模型中的哪个字段进行关联
    justOne: false, // 该虚拟字段的数据是否只有一个
});

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("Category", schema);
