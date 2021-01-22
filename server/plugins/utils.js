async function isExistName(req) {
    // 验证名称是否已存在
    let findOptions = { name: req.body.name || "" };
    const modelName = req.Model.modelName;
    if (modelName === "Category" || modelName === "Menu") {
        findOptions.parent = req.body.parent; // 判断是在同父级下有相同名称
    } else if (modelName === "ApiRight") {
        findOptions = { path: req.body.path };
    }
    const existName = await req.Model.find(findOptions);
    if (existName.length !== 0) {
        console.log(modelName + ": 名称已存在");
        return true;
    }
    return false;
}

// 关联查询哪个字段
function queryOptions(req) {
    const queryOptions = {};
    const modelName = req.Model.modelName;
    // 关联字段查询为可选选项
    if (modelName in { Category: 1, Menu: 1 }) {
        queryOptions.populate = [
            {
                path: "parent",
                select: "name",
                populate: { path: "parent", select: "name" },
            },
            { path: "page", select: "name" },
        ];
    } else if (modelName in { Hero: 1, Article: 1 }) {
        queryOptions.populate = "categories";
    } else if (modelName in { Item: 1, Ming: 1, ApiRight: 1 }) {
        queryOptions.populate = "category";
    } else if (modelName === "AdminUser") {
        queryOptions.populate = "role";
    } else if (modelName === "AdminWeb") {
        queryOptions.populate = {
            path: "menu",
            populate: { path: "parent", populate: "parent" },
        };
    }
    return queryOptions;
}

// 解析url中的排序参数
function getSortObj(str) {
    if (str && str != "undefined") {
        let arr = str.split("/");
        return arr.reduce((obj, v) => {
            let a = v.split(":");
            obj[a[0]] = a[1];
            return obj;
        }, {});
    } else {
        return {};
    }
}

// schema 查询的前置中间件，过滤掉已软删除的数据
function findMiddleware(next) {
    this.where({ isDeleted: { $ne: true } });
    next();
}

module.exports = {
    isExistName,
    queryOptions,
    getSortObj,
    findMiddleware,
};
