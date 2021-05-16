const mongoose = require("mongoose");
const Category = mongoose.model("Category");
const Article = mongoose.model("Article");
const Hero = mongoose.model("Hero");
const Ad = mongoose.model("Ad");

// 获取文章列表（只获取少量字段）
async function getArticleSimpleList() {
    const parent = await Category.findOne({ name: "新闻分类" });
    const newsList = await Category.aggregate([
        { $match: { parent: parent._id } }, // 先过滤, 只要父级分类为新闻分类的分类
        {
            $lookup: {
                // 关联查询
                from: "articles", // 要和哪个集合关联，默认情况下集合名为模型名的复数
                localField: "_id", // 本地键
                foreignField: "categories", // 外键
                as: "list", // 命名字段
            },
        },
        {
            $addFields: {
                // 添加或修改字段
                // $slice 表示获取的长度， 字段 数量
                list: { $slice: ["$list", 5] },
            },
        },
    ]);
    const cats = newsList.map((_) => _._id); // 新闻分类的所有子分类
    // 新增一个热门分类
    newsList.unshift({
        name: "热门",
        list: await Article.find()
            .where({ categories: { $in: cats } })
            .populate("categories")
            .limit(5)
            .lean(),
    });
    // 给每个分类里的列表项加上分类名称, 并只取需要的字段
    const list = newsList.map((cate) => {
        cate.list = cate.list.map((n) => {
            return {
                _id: n._id,
                title: n.title,
                createdAt: n.createdAt,
                categoryName:
                    cate.name == "热门" ? n.categories[0].name : cate.name,
            };
        });
        return cate;
    });
    return list;
}

// 获取英雄列表（只获取少量字段）
async function getHeroSimpleList() {
    const parent = await Category.findOne({ name: "英雄分类" });
    const heroesList = await Category.aggregate([
        { $match: { parent: parent._id } }, // 先过滤, 只要父级分类为英雄分类的分类
        {
            $lookup: {
                // 关联查询
                from: "heroes", // 要和哪个集合关联，默认情况下集合名为模型名的复数
                localField: "_id", // 本地键
                foreignField: "categories", // 外键
                as: "list", // 命名字段
            },
        },
    ]);
    const cats = heroesList.map((_) => _._id); // 英雄分类的所有子分类
    // 新增一个热门分类
    heroesList.unshift({
        name: "热门",
        list: await Hero.find()
            .where({ categories: { $in: cats } })
            .limit(10)
            .lean(),
    });
    // 只需要提取名称和头像还有_id
    const list = heroesList.map((cate) => {
        cate.list = cate.list.map((hero) => {
            return {
                _id: hero._id,
                name: hero.name,
                avatar: hero.avatar,
            };
        });
        return cate;
    });
    return list;
}

// 获取英雄详情
async function getHeroDetail(id) {
    const data = await Hero.findById(id)
        .populate("categories")
        .populate([
            {
                path: "recommendedMings",
                select: { name: 1, icon: 1, effect: 1 },
            },
            {
                path:
                    "recommendedSummoners recommendedItem1.items recommendedItem2.items ",
                select: { name: 1, icon: 1 },
            },
            {
                path: "restraints.hero reRestraints.hero partners.hero", // 关联partners下的hero
                select: { name: 1, avatar: 1 },
            },
        ])
        .lean();
    if (data.skins && data.skins.length > 0) {
        data.title = data.skins[0].name;
        data.banner = data.skins[0].banner;
    }
    return data;
}

// 获取文章详情
async function getArticleDetail(id) {
    const data = await Article.findById(id).lean();
    // 相同分类的相关文章
    data.related = await Article.aggregate([
        { $match: { categories: { $in: data.categories } } },
        { $sample: { size: 2 } }, // 随机选2条数据
    ]);
    return data;
}

// 获取英雄皮肤列表
async function getHeroSkins(id) {
    const data = await Hero.findById(id).select({ name: 1, skins: 1 }).lean();
    return data;
}

// 首页轮播图列表
async function getHomeBanner() {
    const data = await Ad.findOne({ name: "homeBanner" }).lean();
    return data.items;
}

module.exports = {
    getArticleSimpleList,
    getHeroSimpleList,
    getHeroDetail,
    getArticleDetail,
    getHeroSkins,
    getHomeBanner,
};
