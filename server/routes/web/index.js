const {
    getArticleSimpleList,
    getHeroSimpleList,
    getHeroDetail,
    getArticleDetail,
    getHeroSkins,
    getHomeBanner,
} = require("./handler.js");

module.exports = (app) => {
    const router = require("express").Router();

    // 获取文章列表
    router.get("/news/list-simple", async (req, res) => {
        const data = await getArticleSimpleList();
        res.send(data);
    });

    // 获取英雄列表
    router.get("/heroes/list-simple", async (req, res) => {
        const data = await getHeroSimpleList();
        res.send(data);
    });

    // 获取文章详情
    router.get("/articles/:id", async (req, res) => {
        const data = await getArticleDetail(req.params.id);
        res.send(data);
    });

    // 获取英雄详情
    router.get("/heroes/:id", async (req, res) => {
        const data = await getHeroDetail(req.params.id);
        res.send(data);
    });

    // 获取英雄皮肤列表
    router.get("/heroes/:id/skins", async (req, res) => {
        const data = await getHeroSkins(req.params.id);
        res.send(data);
    });

    router.get("/banner/home", async (req, res) => {
        const data = await getHomeBanner();
        res.send(data);
    });

    app.use("/web/api", router);
};
