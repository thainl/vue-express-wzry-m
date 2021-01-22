const express = require("express");

const permissionMiddleware = require("../../middleware/permission"); // 权限中间件
const authMiddleware = require("../../middleware/auth"); // 登录检验中间件
const resourceMiddleware = require("../../middleware/resource"); // 判断请求资源(模型)中间件
const {
    createResourceItem,
    getResourceList,
    getResourceSimpleList,
    getResourceItem,
    updateResourceItem,
    deleteResource,
    uploadFile,
    adminUserLogin,
    getLoginUserInfo,
} = require("./handler");
const upload = require("../../plugins/upload.js");

module.exports = (app) => {
    const router = express.Router({
        mergeParams: true, // 合并来自父路由的params, 可以从子路由访问到父路由的params
    });

    // 新增资源
    router.post("/", permissionMiddleware(), async (req, res) => {
        const data = await createResourceItem(req, res);
        res.send(data);
    });

    // 获取资源列表、搜索
    router.get("/", permissionMiddleware(), async (req, res) => {
        const data = await getResourceList(req);
        res.send(data);
    });

    // 只获取资源列表的名称和_id
    router.get("/selectlist", async (req, res) => {
        const data = await getResourceSimpleList(req);
        res.send(data);
    });

    // 获取资源详情
    router.get("/:id", permissionMiddleware(), async (req, res) => {
        const data = await getResourceItem(req);
        res.send(data);
    });

    // 修改资源
    router.put("/:id", permissionMiddleware(), async (req, res) => {
        const data = await updateResourceItem(req, res);
        res.send(data);
    });

    // 删除单个资源
    router.delete("/:id", permissionMiddleware(), async (req, res) => {
        const data = await deleteResource(req);
        res.send(data);
    });

    // 批量删除
    router.delete("/", permissionMiddleware(), async (req, res) => {
        const data = await deleteResource(req);
        res.send(data);
    });

    // 通用的CRUD操作
    app.use(
        "/admin/api/rest/:resource",
        authMiddleware(),
        resourceMiddleware(),
        router
    );

    // 文件上传
    app.post(
        "/admin/api/upload",
        authMiddleware(),
        permissionMiddleware(),
        upload.single("file"),
        async (req, res) => {
            const data = await uploadFile(req);
            res.send(data);
        }
    );

    // 登录
    app.post("/admin/api/login", async (req, res) => {
        const data = await adminUserLogin(req, app.get("secret"));
        res.send(data);
    });

    // 获取已登录的用户信息
    app.get("/admin/api/user_info", authMiddleware(), async (req, res) => {
        const data = await getLoginUserInfo(req);
        res.send(data);
    });

    // 错误处理
    app.use(async (err, req, res, next) => {
        console.log(err);
        res.status(err.statusCode || 500).send({ msg: err.message });
    });
};
