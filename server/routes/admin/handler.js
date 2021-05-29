const jwt = require("jsonwebtoken");
const fs = require("mz/fs");
const AdminUser = require("../../models/AdminUser");
const Category = require("../../models/Category");
const {
    getSortObj,
    queryOptions,
    isExistName,
    getSearchOptions,
    getSkipFields,
} = require("../../plugins/utils");
const Role = require("../../models/Role");
const oss = require("../../plugins/oss");

// 新增一条数据
async function createResourceItem(req) {
    // 新增前查询是否已存在相同名称
    if (await isExistName(req)) {
        res.send({ errno: 1, msg: "名称已存在" });
        return;
    }
    const model = await req.Model.create(req.body);
    return model;
}

// 获取资源列表
async function getResourceList(req) {
    const page = Number(req.query.page || 1), // 当前页
        size = Number(req.query.size || 0), // 每页条数
        sortOptions = req.query.sort ? getSortObj(req.query.sort) : {}, // 获取排序选项
        searchOptions = await getSearchOptions(req, Category), // 获取搜索选项
        skipFields = getSkipFields(req); // 不获取的字段

    const items = await req.Model.find(searchOptions, skipFields)
        .setOptions(queryOptions(req))
        .collation({ locale: "zh@collation=gb2312han" }) // 中文按拼音排序
        .sort(sortOptions)
        .skip((page - 1) * size)
        .limit(size)
        .lean();

    const totalCount = await req.Model.find(searchOptions).countDocuments(); // 获取符合条件的总条数
    return { items, totalCount };
}

// 获取选择框里的列表资源（只返回尽可能少的字段）
async function getResourceSimpleList(req) {
    let items = await req.Model.find(
        {},
        { name: 1, category: 1, categories: 1, parent: 1 }
    ).setOptions(queryOptions(req));
    return items;
}

// 获取单条数据信息详情
async function getResourceItem(req) {
    const model = await req.Model.findById(req.params.id);
    return model;
}

// 更新单条数据
async function updateResourceItem(req) {
    // 更新前先判断是否已存在相同名称
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

// 删除资源
async function deleteResource(req) {
    let arr = req.params.id ? new Array(req.params.id) : req.body;
    // const result = await req.Model.deleteMany({ _id: { $in: arr } }); // 永久删除
    const result = await req.Model.updateMany(
        { _id: { $in: arr } },
        { $set: { isDeleted: true } }
    ); // 利用mongoose中间件实现软删除
    if (result.deleteCount || result.ok) {
        return { success: true };
    }
    return { success: false };
}

// 上传文件
async function uploadFile(req) {
    const file = req.file;
    file.url = `http://127.0.0.1:2887/uploads/${file.filename}`; // 上传到本地， 如果删除到oss注释该行

    // 如果上传到本地，则这注释3行代码
    // const result = await oss.put("uploads/" + file.filename, file.path); // 上传到阿里oss，需要在oss配置
    // await fs.unlink(file.path); // 上传至oss后删除本地缓存文件
    // file.url = result.url; // 上传oss后返回的url

    return file;
}

// 管理员登录
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

// 获取管理员信息
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
