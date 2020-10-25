module.exports = (options) => {
    const AdminUser = require("../models/AdminUser");
    const Role = require("../models/Role");
    const ServerRight = require("../models/ServerRight");
    const assert = require('http-assert'); // 用于确保信息是否正确，抛出错误
    return async (req, res, next) => {
        console.log("originalUrl: ", req.originalUrl);
        console.log("baseUrl: ", req.baseUrl, req.method);
        // const id = req.user._id;
        const user = await AdminUser.findOne({ name: "user1" });
        const role = await Role.findById(user.role)
            .populate({ path: "rights", populate: { path: "url" } })
            .lean();

        let originalUrl = req.originalUrl;
        if (req.query) {
            originalUrl = originalUrl.split("?")[0];
        }
        const result = role.rights.filter((r) => {
            let myPath = "/admin/api" + r.url.path;
            if (req.params.id) {
                myPath = myPath.replace(":id", req.params.id);
            }
            return (
                myPath === originalUrl && r.method === req.method.toUpperCase()
            );
        });
        if (result.length === 1) {
            console.log(
                "\x1B[36m%s\x1B[0m",
                "有权限访问： " + result[0].description
            );
        }else {
            console.log('\x1B[31m%s\x1B[0m', '无权限访问： ' + originalUrl + ' ' + req.method);
            
        }
        // assert(result.length, 422, '无权访问')
        next();
    };
};
