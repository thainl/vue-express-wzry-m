const mongoose = require("mongoose");
const { findMiddleware } = require("../plugins/utils");

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    summonerId: { type: Number },
    icon: {
        type: String,
    },
    unlockLevel: { type: Number }, // 技能解锁等级
    description: { type: String }, // 召唤师技能描述
    isDeleted: { type: Boolean },
});

// 前置中间件，过滤掉软删除
schema.pre("find", findMiddleware);
schema.pre("findOne", findMiddleware);
schema.pre("updateMany", findMiddleware);
schema.pre("countDocuments", findMiddleware);

module.exports = mongoose.model("Summoner", schema);
