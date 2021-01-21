const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Category" }],
        author: { type: String },
        body: { type: String },
        isDeleted: { type: Boolean },
    },
    {
        timestamps: true,
    }
);

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("Article", schema);
