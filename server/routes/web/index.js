module.exports = (app) => {
    const router = require('express').Router();
    const mongoose = require('mongoose');
    const Category = mongoose.model('Category');
    const Article = mongoose.model('Article');
    const Hero = mongoose.model('Hero');
    const Ad = mongoose.model('Ad');
    const Item = mongoose.model('Item');
    const Ming = mongoose.model('Ming');
    const Summoner = mongoose.model('Summoner');
    const herolist = require('./herolist.json');
    const itemlist = require('./item.json');
    const minglist = require('./ming.json');
    const summonerlist = require('./summoner.json');

    // // 录入文章数据
    // router.get('/news/init', async (req, res) => {
    //     const cat = await Category.findOne({name: '赛事'}).lean(); // lean 表示取纯粹的json数据
    //     const data = ["2020年秋冬赛事战令全新升级，终极奖励韩信星元皮肤等你拿！", "2020年KPL秋季赛9月16日热血开赛，主场地域化全面升级", "2020年KPL秋季赛热血来袭，线下售票9月7日12:00开启！", "2020年KGL秋季赛选手大名单公布，9月13日该我上场！", "2020年KPL秋季赛大名单公布", "王者荣耀电竞推出六大措施打造全民参与体验闭环", "2020年王者荣耀世界冠军杯总决赛门票8月10日正式开售", "8月7日【比赛服】版本更新公告", "7月29日【比赛服】版本更新公告", "7月13日【比赛服】版本更新公告", "2020年王者荣耀世界冠军杯小组赛赛程出炉", "2020年王者荣耀世界冠军杯第二轮选拔赛 加赛及抽签规则", "世冠小组赛抽签仪式6月28日现场直播，小组赛之战一触即发！", "2020年王者荣耀世界冠军杯（KCC）赛事规则", "无惧挑战向阳而生，TS冠军之夜今日18:00惊喜来袭"]
    //     newsList = data.map(item => {
    //         return {
    //             title: item,
    //             categories: [cat]
    //         }
    //     })
    //     // await Article.insertMany(newsList);
    //     res.send(newsList);
    // })

    // 录入英雄数据
    // router.get('/heroes/init', async (req, res) => {
    //     const catZS = await Category.findOne({name:'战士'}).lean();
    //     const catFS = await Category.findOne({name:'法师'}).lean();
    //     const catTK = await Category.findOne({name:'坦克'}).lean();
    //     const catCK = await Category.findOne({name:'刺客'}).lean();
    //     const catSS = await Category.findOne({name:'射手'}).lean();
    //     const catFZ = await Category.findOne({name:'辅助'}).lean();
    //     const catArr = [catZS, catFS, catTK, catCK, catSS, catFZ]

    //     const list = herolist.map(hero => {
    //         const categories = [catArr[hero.hero_type-1]];
    //         if(hero.hero_type2) {
    //             categories.push(catArr[hero.hero_type2-1])
    //         }
    //         let skins = [];
    //         if(hero.skin_name) {
    //             const skinsName = hero.skin_name.split('|')
    //             skins = skinsName.map(skin => {
    //                 return {
    //                     name: skin
    //                 }
    //             })
    //         }

    //         return {
    //             name: hero.cname,
    //             heroId: Number(hero.ename),
    //             avatar: `http://127.0.0.1:2887/uploads/${hero.ename}.jpg`,
    //             "scores" : {
    //                 "difficult" : 1,
    //                 "skills" : 1,
    //                 "attack" : 1,
    //                 "survive" : 1
    //             },
    //             categories,
    //             skins
    //         }
    //     })
    //     // await Hero.insertMany(list);
    //     res.send(list);
    // })


    // // 录入物品数据
    // router.get('/items/init', async (req, res) => {
    //     const catZS = await Category.findOne({name:'攻击'}).lean();
    //     const catFS = await Category.findOne({name:'法术'}).lean();
    //     const catTK = await Category.findOne({name:'防御'}).lean();
    //     const catCK = await Category.findOne({name:'移动'}).lean();
    //     const catSS = await Category.findOne({name:'打野'}).lean();
    //     const catFZ = await Category.findOne({name:'游走'}).lean();
    //     const catArr = [catZS, catFS, catTK, catCK, catSS, null, catFZ];

    //     const list = itemlist.map(item => {
    //         return {
    //             name: item.item_name,
    //             itemId: Number(item.item_id),
    //             icon: `http://127.0.0.1:2887/uploads/${item.item_id}.jpg`,
    //             "price" : item.price,
    //             "category" : catArr[item.item_type - 1],
    //             "totalPrice" : item.total_price,
    //             "description" : item.des2 ? item.des2 : '',
    //             "effect" : item.des1,
    //         }
    //     })
    //     // await Item.deleteMany({});
    //     // await Item.insertMany(list);
    //     res.send(list);
    // })

    // 录入铭文数据
    // router.get('/mings/init', async (req, res) => {
    //     const red = await Category.findOne({name:'红'}).lean();
    //     const green = await Category.findOne({name:'绿'}).lean();
    //     const blue = await Category.findOne({name:'蓝'}).lean();
    //     const catObj = { red, blue: green, yellow: blue };

    //     const list = minglist.map(ming=> {
    //         return {
    //             name: ming.ming_name,
    //             mingId: Number(ming.ming_id),
    //             icon: `https://game.gtimg.cn/images/yxzj/img201606/mingwen/${ming.ming_id}.png`,
    //             category: catObj[ming.ming_type],
    //             grade: Number(ming.ming_grade),
    //             effect: ming.ming_des,
    //         }
    //     })
    //     // await Ming.deleteMany({});
    //     // await Ming.insertMany(list);
    //     res.send(list);
    // })

    // 录入召唤师技能
    // router.get('/summoners/init', async (req, res) => {
    //     const list = summonerlist.map(s=> {
    //         return {
    //             name: s.summoner_name,
    //             summonerId: Number(s.summoner_id),
    //             icon: `http://127.0.0.1:2887/uploads/${s.summoner_id}.jpg`,
    //             unlockLevel: Number(s.summoner_rank.match(/[\d]+/g)),
    //             description: s.summoner_description
    //         }
    //     })
    //     // await Summoner.deleteMany({});
    //     // await Summoner.insertMany(list);
    //     res.send(list)
    // })


    // 获取文章列表
    router.get('/news/list-simple', async (req, res) => {
        // const data = await Category.findOne({name: '新闻分类'}).populate('children').lean();
        const parent = await Category.findOne({name: '新闻分类'});
        const newsList = await Category.aggregate([
            { $match: { parent: parent._id } }, // 先过滤, 只要父级分类为新闻分类的分类
            {
                $lookup: { // 关联查询
                    from: 'articles', // 要和哪个集合关联，默认情况下集合名为模型名的复数
                    localField: '_id', // 本地键
                    foreignField: 'categories', // 外键
                    as: 'list', // 命名字段
                }
            },
            {
                $addFields: { // 添加或修改字段
                    // $slice 表示获取的长度， 字段 数量 
                    list: { $slice: ['$list', 5] }
                }
            }
        ])
        const cats = newsList.map(_ => _._id); // 新闻分类的所有子分类
        // 新增一个热门分类
        newsList.unshift({
            name: '热门',
            list: await Article.find().where({categories: {$in: cats}}).populate('categories').limit(5).lean()
        })
        // 给每个分类里的列表项加上分类名称, 并只取需要的字段
        const list = newsList.map(cate => {
            cate.list = cate.list.map(n => {
                return {
                    _id: n._id,
                    title: n.title,
                    createdAt: n.createdAt,
                    categoryName: (cate.name == '热门') ? n.categories[0].name : cate.name
                }
            })
            return cate;
        })
        res.send(list);
    })


    // 获取英雄列表
    router.get('/heroes/list-simple', async (req, res) => {
        const parent = await Category.findOne({name: '英雄分类'});
        const heroesList = await Category.aggregate([
            { $match: { parent: parent._id } }, // 先过滤, 只要父级分类为英雄分类的分类
            {
                $lookup: { // 关联查询
                    from: 'heroes', // 要和哪个集合关联，默认情况下集合名为模型名的复数
                    localField: '_id', // 本地键
                    foreignField: 'categories', // 外键
                    as: 'list', // 命名字段
                }
            }
        ])
        const cats = heroesList.map(_ => _._id); // 英雄分类的所有子分类
        // 新增一个热门分类
        heroesList.unshift({
            name: '热门',
            list: await Hero.find().where({categories: {$in: cats}}).limit(10).lean()
        })
        // 只需要提取名称和头像还有_id
        const list = heroesList.map(cate => {
            cate.list = cate.list.map(hero => {
                return {
                    _id: hero._id,
                    name: hero.name,
                    avatar: hero.avatar
                }
            })
            return cate;
        })
        res.send(list);
    })

    // 获取文章详情
    router.get('/articles/:id', async (req, res) => {
        const data = await Article.findById(req.params.id).lean();
        // 相同分类的相关文章
        data.related = await Article.aggregate([
            { $match: { categories: { $in: data.categories } } },
            { $sample: { size: 2 } }, // 随机选2条数据
        ])
        res.send(data);
    })

    // 获取英雄详情
    router.get('/heroes/:id', async (req, res) => {
        const data = await Hero.findById(req.params.id)
            .populate('categories')
            .populate([
                {
                    path: 'recommendedMings',
                    select: { name: 1, icon: 1, effect: 1 }
                },
                {
                    path: 'recommendedSummoners recommendedItem1.items recommendedItem2.items ',
                    select: { name: 1, icon: 1 } 
                },
                {
                    path: 'restraints.hero reRestraints.hero partners.hero',
                    select: { name: 1, avatar: 1}
                }
            ])
            .lean();
        if(data.skins && data.skins.length > 0) {
            data.title = data.skins[0].name;
            data.banner = data.skins[0].banner;
        }
        res.send(data);
    })

    // 获取英雄皮肤列表
    router.get('/heroes/:id/skins', async (req, res) => {
        const data = await Hero.findById(req.params.id)
            .select({ name: 1, skins: 1 })
            .lean();
        res.send(data);
    })

    router.get('/banner/home', async (req, res) => {
        const data = await Ad.findOne({name: 'homeBanner'}).lean();
        res.send(data.items);
    })
    
    app.use('/web/api', router);
};