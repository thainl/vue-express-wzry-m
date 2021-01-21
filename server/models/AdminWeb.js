const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    name: { type: String },
    path: { type: String },
    menu: { type: mongoose.SchemaTypes.ObjectId, ref: "Menu" },
    rights: [
        {
            type: String,
            validate: {
                validator: function (val) {
                    return (
                        ["GET", "POST", "PUT", "DELETE", "SEARCH"].indexOf(
                            val
                        ) !== -1
                    );
                },
                message: "web right is wrong",
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

module.exports = mongoose.model("AdminWeb", schema);
