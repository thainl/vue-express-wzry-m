const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    rights: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "ServerRight",
        },
    ],
    adminWebs: [
        {
            web: { type: mongoose.SchemaTypes.ObjectId, ref: "AdminWeb" },
            rights: [{ type: String }],
        },
    ],
    apiRights: [
        {
            url: { type: mongoose.SchemaTypes.ObjectId, ref: "ApiRight" },
            rights: [{ type: String }],
        },
    ],
    isDeleted: { type: Boolean },
});

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("Role", schema);
