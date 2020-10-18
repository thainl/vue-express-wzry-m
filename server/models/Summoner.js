const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String
    },
    icon: {
        type: String
    },
    unlockLevel: { type: Number }, // 技能解锁等级
    description: { type: String }, // 召唤师技能描述
});

module.exports = mongoose.model('Summoner', schema);