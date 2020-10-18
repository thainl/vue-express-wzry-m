const { exit } = require('process');
const jwt = require('jsonwebtoken');
const AdminUser = require('../../models/AdminUser');
const assert = require('http-assert'); // 用于确保信息是否正确，抛出错误

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
        const items = await req.Model.find().setOptions(queryOptions).limit(100);
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

    // 登录检验中间件
    const authMiddleware = require('../../middleware/auth');

    // 判断请求资源(模型)中间件
    const resourceMiddleware = require('../../middleware/resource');

    // 通用的CRUD操作
    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

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
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res)=> {
        const file = req.file;
        file.url = `http://127.0.0.1:2887/uploads/${file.filename}`;
        res.send(file);
    })

    // 登录
    app.post('/admin/api/login', async(req, res) => {
        // 查找用户
        const { name, password } = req.body;
        const user = await AdminUser.findOne({ name }).select('+password'); // 读取password字段
        assert(user, 422, '用户不存在');
        // 检验密码
        const isValid = require('bcrypt').compareSync(password, user.password);
        assert(isValid, 422, '密码错误');
        // 返回token
        let token = jwt.sign({ id: user._id }, app.get('secret')); // 生成密钥（要传递的信息， 密钥）
        res.send({ token })
    })

    app.get('/admin/api/userinfo', async(req, res) => {
        const token = String(req.headers.authorization || '').split(' ').pop();
        const { id } = jwt.verify(token, app.get('secret'));
        const user = await AdminUser.findById(id);
        res.send(user);
    })


    // 错误处理
    app.use(async(err, req, res, next) => {
        console.log(err);
        res.status(err.statusCode || 500).send({msg: err.message})
    })
};