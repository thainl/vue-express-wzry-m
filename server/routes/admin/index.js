const express = require("express");
const jwt = require("jsonwebtoken");
const AdminUser = require("../../models/AdminUser");
const Category = require("../../models/Category");
const {
    getSortObj,
    queryOptions,
    isExistName,
} = require("../../plugins/utils");
const assert = require("http-assert"); // 用于确保信息是否正确，抛出错误

// 权限中间件
const permissionMiddleware = require("../../middleware/permission");
const Role = require("../../models/Role");

module.exports = (app) => {
    const router = express.Router({
        mergeParams: true, // 合并来自父路由的params, 可以从子路由访问到父路由的params
    });

    // 新增资源
    router.post("/", permissionMiddleware(), async (req, res) => {
        if (await isExistName(req)) {
            res.send({ errno: 1, msg: "名称已存在" });
            return;
        }
        const model = await req.Model.create(req.body);
        res.send(model);
    });

    // 获取资源列表、搜索
    router.get("/", permissionMiddleware(), async (req, res) => {
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
                    { categories: { $all: cate } },
                    { path: { $regex: reg } }, // 搜索接口路径
                    { description: { $regex: reg } },
                    { methods: { $regex: reg } },
                    { rights: { $regex: reg } },
                ],
            };
        }

        const items = await req.Model.find(searchOptions, {
            password: 0,
            body: 0,
        })
            .setOptions(queryOptions(req))
            .collation({locale:'zh@collation=gb2312han'})
            .sort(sortOptions)
            .skip((page - 1) * size)
            .limit(size)
            .lean();

        const totalCount = await req.Model.find(searchOptions).countDocuments();

        res.send({ items, totalCount });
    });

    async function getList(req, size, page) {
        size = size ? Number(size) : 200;
        page = page ? Number(page) : 1;
        const items = await req.Model.find()
            .setOptions(queryOptions(req))
            .sort({ _id: 1 })
            .skip((page - 1) * size)
            .limit(size)
            .lean();
        const totalCount = await req.Model.countDocuments();
        return { totalCount, items };
    }

    // 只获取资源列表的名称和_id
    router.get("/selectlist", async (req, res) => {
        let items = await req.Model.find(
            {},
            { name: 1, category: 1, categories: 1, parent: 1 }
        ).setOptions(queryOptions(req));

        res.send(items);
    });

    // 搜索
    router.get("/search", permissionMiddleware(), async (req, res) => {
        let { keyword, page, size } = req.query;
        page = page ? Number(page) : 1;
        size = size ? Number(size) : 10;
        const reg = new RegExp(keyword, "i"); // 利用正则进行模糊查询
        const cate = await Category.find({ name: { $regex: reg } }); // 查找分类
        // const result = await req.Model.find().setOptions(queryOptions(req)).find(
        //     {
        //         $or: [ // 多条件
        //             { name: { $regex: reg } },
        //             { title: { $regex: reg } },
        //             { body: { $regex: keyword, $options: '$i' } }, // 也可以这样写，忽略大小写
        //             { parent: cate },
        //             { category: cate },
        //             { categories: { $all: cate } }
        //         ]

        //     },
        //     {
        //         password: 0, // 返回的结果不包含密码字段
        //     },
        // ).skip(size * ( page - 1 )).limit(size)
        req.Model.find()
            .setOptions(queryOptions(req))
            .find(
                {
                    $or: [
                        // 多条件
                        { name: { $regex: reg } },
                        { title: { $regex: reg } },
                        { body: { $regex: keyword, $options: "$i" } }, // 也可以这样写，忽略大小写
                        { parent: cate },
                        { category: cate },
                        { categories: { $all: cate } },
                        { path: { $regex: reg } }, // 搜索接口路径
                        { description: { $regex: reg } },
                        { methods: { $regex: reg } },
                        { rights: { $regex: reg } },
                    ],
                },
                {
                    password: 0, // 返回的结果不包含密码字段
                }
            )
            .then((result) => {
                res.send({
                    totalCount: result.length,
                    items: result.slice(
                        size * (page - 1),
                        size * (page - 1) + size
                    ),
                });
            });
    });

    // 获取资源详情
    router.get("/:id", permissionMiddleware(), async (req, res) => {
        const model = await req.Model.findById(req.params.id);
        res.send(model);
    });

    // 修改资源
    router.put("/:id", permissionMiddleware(), async (req, res) => {
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
        const model = await req.Model.findByIdAndUpdate(
            req.params.id,
            req.body
        );
        res.send(model);
    });

    // 删除资源
    router.delete("/:id", permissionMiddleware(), async (req, res) => {
        await req.Model.findByIdAndRemove(req.params.id);
        res.send({ success: true });
    });

    // 登录检验中间件
    const authMiddleware = require("../../middleware/auth");

    // 判断请求资源(模型)中间件
    const resourceMiddleware = require("../../middleware/resource");

    // 通用的CRUD操作
    app.use(
        "/admin/api/rest/:resource",
        authMiddleware(),
        resourceMiddleware(),
        router
    );

    // 上传图片
    const multer = require("multer");
    const { resolve } = require("path");
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // 存放路径
            cb(null, resolve(__dirname, "../../public/uploads"));
        },
        filename: function (req, file, cb) {
            // 命名文件名
            const random = (Math.random() * 1000000).toString().substring(0, 5);
            cb(
                null,
                "file" +
                    Date.now() +
                    "-" +
                    random +
                    "." +
                    file.mimetype.match(/\/([a-z]+)$/i)[1]
            );
        },
    });
    const upload = multer({ storage });
    app.post(
        "/admin/api/upload",
        authMiddleware(),
        permissionMiddleware(),
        upload.single("file"),
        async (req, res) => {
            const file = req.file;
            file.url = `http://127.0.0.1:2887/uploads/${file.filename}`;
            res.send(file);
        }
    );

    // 登录
    app.post("/admin/api/login", async (req, res) => {
        // 查找用户
        const { name, password } = req.body;
        const user = await AdminUser.findOne({ name }).select("+password"); // 读取password字段
        assert(user, 422, "用户不存在");
        // 检验密码
        const isValid = require("bcrypt").compareSync(password, user.password);
        assert(isValid, 422, "密码错误");
        // 返回token
        let token = jwt.sign({ id: user._id }, app.get("secret")); // 生成密钥（要传递的信息， 密钥）
        res.send({ token });
    });

    app.get("/admin/api/userinfo", authMiddleware(), async (req, res) => {
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
        res.send(user);
    });

    // 错误处理
    app.use(async (err, req, res, next) => {
        console.log(err);
        res.status(err.statusCode || 500).send({ msg: err.message });
    });
};
