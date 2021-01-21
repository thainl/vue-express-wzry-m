const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    name: { type: String },
    items: [
        {
            title: { type: String },
            description: { type: String },
            image: { type: String },
            url: { type: String },
        },
    ],
    isDeleted: { type: Boolean },
});

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("Ad", schema);
