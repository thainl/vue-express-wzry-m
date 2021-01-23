const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    path: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    methods: [
        {
            type: String,
            validate: {
                validator: function (val) {
                    return ["GET", "POST", "PUT", "DELETE", "SEARCH"].indexOf(val) !== -1;
                },
                message: "api method is wrong",
            },
        },
    ],
    description: { type: String },
    isDeleted: { type: Boolean },
});

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("ApiRight", schema);
