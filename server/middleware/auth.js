module.exports = options => {
    const jwt = require('jsonwebtoken');
    const AdminUser = require('../models/AdminUser');
    const assert = require('http-assert'); // 用于确保信息是否正确，抛出错误
    return async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop(); // 获取数组最后一个
        assert(token, 401, 'token不存在，请先登录'); // 抛出错误，在最后统一处理
        const { id } = jwt.verify(token, req.app.get('secret')); // 校验解密token
        assert(id, 401, '无效的token，请重新登录');
        req.user = await AdminUser.findById(id).lean();
        assert(req.user, 401, '请登录');
        next();
    }
}