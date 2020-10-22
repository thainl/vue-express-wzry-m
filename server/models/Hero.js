const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    heroId: { type: Number},
    name: {
        type: String,
    },
    avatar: {
        type: String,
    },
    // title: {type: String}, // 称号
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Category" }],
    scores: {
        difficult: { type: Number }, // 难度
        skills: { type: Number }, // 技能
        attack: { type: Number }, // 攻击
        survive: { type: Number }, // 生存 
    },
    skills: [{
        icon: { type: String },
        name: { type: String },
        description: { type: String },
        tips: { type: String },
        consume: { type: Number }, // 技能消耗
        cooldowns: [{ type: Number }], // 技能冷却
    }],
    // items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }], // 顺风出装
    // items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }], // 逆风出装
    recommendedSkill1: { type: String }, // 主升技能，存放了技能_id, 需要先保存技能才能生成_id
    recommendedSkill2: { type: String }, // 富升技能
    recommendedSummoners: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Summoner' }],
    recommendedMings: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Ming' }],
    recommendedItem1: { // 顺风出装
        items: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
        tips: { type: String }
    },
    recommendedItem2: { // 逆风出装
        items: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
        tips: { type: String }
    },
    usageTips: { type: String }, // 使用技巧
    battleTips: { type: String }, // 对抗技巧
    teamTips: { type: String }, // 团战思路
    partners: [{ // 最佳搭档
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
        description: { type: String }
    }],
    restraints: [{ // 克制哪些英雄
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
        description: { type: String }
    }],
    reRestraints: [{ // 被哪些英雄克制
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
        description: { type: String }
    }],
    skins: [{
        name: { type: String },
        description: { type: String },
        img: { type: String },
        banner: { type: String }
    }]
});

module.exports = mongoose.model("Hero", schema, 'heroes');
