const { exit } = require('process');

module.exports = app => {
    const express = require('express');
    const router = express.Router({
        mergeParams: true, // 合并来自父路由的params, 可以从子路由访问到父路由的params
    });

    async function isExistName (req) { // 验证名称是否已存在
        const findOptions = {name: req.body.name};
        if(req.Model.modelName === 'Category') {
            findOptions.parent = req.body.parent;
        }
        const existName = await req.Model.find(findOptions);
        if(existName.length !== 0) {
            console.log('名称已存在');
            return true;
        }
        return false;
    }

    // 新增分类
    router.post('/', async(req, res) => {
        if(await isExistName(req)) {
            res.send({errno: 1, msg: '名称已存在'});
            return;
        }
        const model = await req.Model.create(req.body);
        res.send(model);
    })

    // 获取分类列表
    router.get('/', async (req, res)=> {
        const queryOptions = {};
        // 关联字段查询为可选选项
        if(req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent';
        }else if(req.Model.modelName === 'Hero') {
            queryOptions.populate = 'categories';
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(20);
        res.send(items);
    })

    // 获取分类详情
    router.get('/:id', async(req, res) => {
        const model = await req.Model.findById(req.params.id);
        res.send(model);
    })

    // 修改分类
    router.put('/:id', async (req, res) => {
        const exist = await req.Model.findById(req.params.id);
        if(exist.name != req.body.name || req.body.parent && exist.parent != req.body.parent) { // 判断修改时名称或parent是否发生更改
            if(await isExistName(req)) {
                res.send({errno: 1, msg: '名称已存在'});
                return;
            }
        }
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
        res.send(model);
    })

    // 删除分类
    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndRemove(req.params.id);
        res.send({success: true});
    })

    // 通用的CRUD操作
    app.use('/admin/api/rest/:resource',async (req, res, next) => {
        const modelName = require('inflection').classify(req.params.resource); // 转换为类名格式：复数变单数，首字母大写
        const Model = require('../../models/' + modelName); // 引用mongoose 模型
        req.Model = Model;
        next();
    }, router)

    // 上传图片
    const multer = require('multer');
    const { resolve } = require('path');
    const storage = multer.diskStorage({
        destination: function(req, file, cb) { // 存放路径
            cb(null, resolve(__dirname, '../../public/uploads'));
        },
        filename: function(req, file, cb) { // 命名文件名
            const random = (Math.random() * 1000000).toString().substring(0, 5);
            cb(null, 'file' + Date.now() + '-' + random + '.' + file.mimetype.match(/\/([a-z]+)$/i)[1])
        }
    })
    const upload = multer({ storage })
    app.post('/admin/api/upload', upload.single('file'), async (req, res)=> {
        const file = req.file;
        file.url = `http://127.0.0.1:2887/uploads/${file.filename}`;
        res.send(file);
    })
};