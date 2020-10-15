const { exit } = require('process');

module.exports = app => {
    const express = require('express');
    const router = express.Router({
        mergeParams: true, // 合并来自父路由的params, 可以从子路由访问到父路由的params
    });

    async function isExistName (req) { // 验证名称是否已存在
        if(!req.body.name) return false;
        const findOptions = {name: req.body.name};
        if(req.Model.modelName === 'Category') {
            findOptions.parent = req.body.parent;
        }
        const existName = await req.Model.find(findOptions);
        console.log(existName);
        if(existName.length !== 0) {
            console.log('名称已存在');
            return true;
        }
        return false;
    }

    // 新增资源
    router.post('/', async(req, res) => {
        if(await isExistName(req)) {
            res.send({errno: 1, msg: '名称已存在'});
            return;
        }
        const model = await req.Model.create(req.body);
        res.send(model);
    })

    // 获取资源列表
    router.get('/', async (req, res)=> {
        const queryOptions = {};
        // 关联字段查询为可选选项
        if(req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent';
        }else if(req.Model.modelName === 'Hero' || req.Model.modelName === 'Article') {
            queryOptions.populate = 'categories';
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(20);
        res.send(items);
    })

    // 获取资源详情
    router.get('/:id', async(req, res) => {
        const model = await req.Model.findById(req.params.id);
        res.send(model);
    })

    // 修改资源
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

    // 删除资源
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

    // 登录
    app.post('/admin/api/login', async(req, res) => {
        // 查找用户
        const AdminUser = require('../../models/AdminUser');
        const { name, password } = req.body;
        const user = await AdminUser.findOne({ name }).select('+password'); // 读取password字段
        if(!user) {
            return res.status(422).send({msg: '用户不存在'});
        }
        // 检验密码
        const isValid = require('bcrypt').compareSync(password, user.password);
        if(isValid) {
            return res.status(422).send({msg: '密码错误'});
        }
        // 返回token
        const jwt = require('jsonwebtoken');
        jwt.sign({ id: user._id }, app.get('secret')); // 生成密钥（要传递的信息， 密钥）
        res.send({ token })
    })
};