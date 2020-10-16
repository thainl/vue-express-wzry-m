module.exports = options => {
    return async (req, res, next) => {
        // 判断请求用到的模型
        const modelName = require('inflection').classify(req.params.resource); // 转换为类名格式：复数变单数，首字母大写
        const Model = require('../models/' + modelName); // 引用mongoose 模型
        req.Model = Model;
        next();
    }
};