module.exports = (options) => {
    const AdminUser = require("../models/AdminUser");
    const Role = require("../models/Role");
    const assert = require('http-assert'); // 用于确保信息是否正确，抛出错误
    return async (req, res, next) => {
        const user = req.user;
        const role = await Role.findById(user.role)
            .populate({ path: "apiRights.url" })
            .lean();

        let originalUrl = req.query ? req.originalUrl.split("?")[0] : req.originalUrl;
        const result = role.apiRights.filter((r) => {
            let myPath = "/admin/api" + r.url.path;
            if (req.params.id) {
                myPath = myPath.replace(":id", req.params.id);
            }
            return (
                myPath === originalUrl && r.rights.indexOf(req.method.toUpperCase()) !== -1
            );
        });
        if (result.length === 1) {
            console.log(
                "\x1B[36m%s\x1B[0m",
                "有权限访问： " + result[0].url.path + ' ' + req.method
            );
        }else {
            console.log('\x1B[31m%s\x1B[0m', '无权限访问： ' + originalUrl + ' ' + req.method);
            
        }
        assert(result.length, 422, '无权限进行此操作');
        next();
    };
};
