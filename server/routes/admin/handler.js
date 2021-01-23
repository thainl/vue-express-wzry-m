const jwt = require("jsonwebtoken");
const fs = require("mz/fs");
const AdminUser = require("../../models/AdminUser");
const Category = require("../../models/Category");
const {
    getSortObj,
    queryOptions,
    isExistName,
} = require("../../plugins/utils");
const Role = require("../../models/Role");
const oss = require("../../plugins/oss");

async function createResourceItem(req) {
    if (await isExistName(req)) {
        res.send({ errno: 1, msg: "名称已存在" });
        return;
    }
    const model = await req.Model.create(req.body);
    return model;
}

async function getResourceList(req) {
    const page = Number(req.query.page || 1),
        size = Number(req.query.size || 0),
        sortOptions = req.query.sort ? getSortObj(req.query.sort) : {};
    let searchOptions = {};
    if (req.query.search) {
        let reg = new RegExp(req.query.search, "i");
        const cate = await Category.find({ name: { $regex: reg } }); // 查找分类
        searchOptions = {
            $or: [
                // 多条件
                { name: { $regex: reg } },
                { title: { $regex: reg } },
                { body: { $regex: req.query.search, $options: "$i" } }, // 也可以这样写，忽略大小写
                { parent: cate },
                { category: cate },
                { categories: { $in: cate } },
                { path: { $regex: reg } }, // 搜索接口路径
                { description: { $regex: reg } },
                { methods: { $regex: reg } },
                { rights: { $regex: reg } },
            ],
        };
    }

    let skipFields = { // 不提取的字段
        password: 0,
        body: 0,
    };

    if (req.Model.modelName === "Hero") {
        Object.assign(skipFields, {
            partners: 0,
            skills: 0,
            scores: 0,
            teamTips: 0,
            usageTips: 0,
            battleTips: 0,
            reRestraints: 0,
            restraints: 0,
            recommendedItem1: 0,
            recommendedItem2: 0,
            skins: 0,
            recommendedMings: 0,
            recommendedSummoners: 0,
            recommendedSkill1: 0,
            recommendedSkill2: 0,
        });
    }

    const items = await req.Model.find(searchOptions, skipFields)
        .setOptions(queryOptions(req))
        .collation({ locale: "zh@collation=gb2312han" })
        .sort(sortOptions)
        .skip((page - 1) * size)
        .limit(size)
        .lean();

    const totalCount = await req.Model.find(searchOptions).countDocuments();
    return { items, totalCount };
}

async function getResourceSimpleList(req) {
    let items = await req.Model.find(
        {},
        { name: 1, category: 1, categories: 1, parent: 1 }
    ).setOptions(queryOptions(req));
    return items;
}

async function getResourceItem(req) {
    const model = await req.Model.findById(req.params.id);
    return model;
}

async function updateResourceItem(req) {
    const exist = await req.Model.findById(req.params.id);
    if (
        exist.name != req.body.name ||
        (req.body.parent && exist.parent != req.body.parent)
    ) {
        // 判断修改时名称或parent是否发生更改
        if (await isExistName(req)) {
            res.send({ errno: 1, msg: "名称已存在" });
            return;
        }
    }
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    return model;
}

async function deleteResource(req) {
    let arr = req.params.id ? new Array(req.params.id) : req.body;
    // const result = await req.Model.deleteMany({ _id: { $in: arr } });
    const result = await req.Model.updateMany(
        { _id: { $in: arr } },
        { $set: { isDeleted: true } }
    ); // 软删除
    if (result.deleteCount || result.ok) {
        return { success: true };
    }
    return { success: false };
}

async function uploadFile(req) {
    const file = req.file;
    // file.url = `http://127.0.0.1:2887/uploads/${file.filename}`; // 上传到本地

    const result = await oss.put("uploads/" + file.filename, file.path); // 上传到阿里oss
    await fs.unlink(file.path); // 上传至oss后删除本地文件

    file.url = result.url;
    return file;
}

async function adminUserLogin(req, secret) {
    // 查找用户
    const { name, password } = req.body;
    let data = {};
    const user = await AdminUser.findOne({ name }).select("+password"); // 读取password字段
    if (!user) {
        data = { error: 1, msg: "用户不存在" };
    } else if (!require("bcrypt").compareSync(password, user.password)) {
        data = { error: 2, msg: "密码错误" };
    } else {
        let token = jwt.sign({ id: user._id }, secret); // 生成密钥（要传递的信息， 密钥）
        data = { ok: 1, token };
    }
    return data;
}

async function getLoginUserInfo(req) {
    const user = req.user;
    const role = await Role.find({ _id: user.role })
        .populate({
            path: "adminWebs.web",
            populate: {
                path: "menu",
                populate: {
                    path: "parent",
                    populate: "parent",
                },
            },
        })
        .lean();
    user.adminWebs = role[0].adminWebs;
    return user;
}

module.exports = {
    createResourceItem,
    getResourceList,
    getResourceSimpleList,
    getResourceItem,
    updateResourceItem,
    deleteResource,
    uploadFile,
    adminUserLogin,
    getLoginUserInfo,
};
