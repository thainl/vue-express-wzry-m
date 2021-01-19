let rightMapping = {
    'GET': '获取数据',
    'POST': '新增操作',
    'PUT': '修改操作',
    'DELETE': '删除操作',
    'SEARCH': '搜索操作',
}
function makePageItem(item, isTree) {
    item.type = "page";
    if (isTree) {
        item.label = item.name;
        item.id = item._id;
        item.children = item.rights.map((r) => {
            return {
                id: r + "-" + item._id,
                label: r,
                type: "right",
                right: r,
                parentId: item._id,
                desc: rightMapping[r],
            };
        });
    }
    return item;
}
/**
 * 
 * @param {array} arr 后台页面集合
 * @param {boolean} isTree 是要生成树形图
 */
function makeWebTree(arr, isTree) {
    let hasMenu = []; // 有对应菜单的页面
    let noMenu = []; // 无对应菜单的页面
    let resData = [];
    arr.forEach((item) => {
        if (item.menu) {
            hasMenu.push(item);
        } else {
            noMenu.push(item);
        }
    });
    let obj = {};
    let uniqueCate = hasMenu.reduce((arr, item) => {
        let flag = item.menu.parent.parent;
        if (!obj[flag._id]) {
            obj[flag._id] = true;
            arr.push(flag);
        }
        return arr;
    }, []);
    let uniqueGroup = hasMenu.reduce((arr, item) => {
        let flag = item.menu.parent;
        if (!obj[flag._id]) {
            obj[flag._id] = true;
            arr.push({
                _id: flag._id,
                name: flag.name,
                parentId: flag.parent._id,
                icon: flag.icon
            });
        }
        return arr;
    }, []);
    resData = uniqueCate.map((c, i) => {
        if(isTree) {
            c.label = c.name + "分类";
            c.id = i + 1;
        }
        c.type = "cate";
        c.children = [];
        uniqueGroup.forEach((g, j) => {
            if(isTree) {
                g.label = g.name + "分组";
                g.id = Number(c.id + "00" + (j + 1));
            }
            g.type = "group";
            g.children = [];
            hasMenu.forEach((item) => {
                item = makePageItem(item, isTree);
                if (item.menu.parent._id === g._id) {
                    // 按分组分层
                    g.children.push(item);
                }
            });

            if (g.parentId === c._id) {
                // 按分类分层
                c.children.push(g);
            }
        });
        return c;
    });
    if (noMenu.length > 0 && isTree) {
        let noMenuCate = {
            id: 99999,
            label: "无菜单页面分类",
            type: "cate",
            children: [],
        };
        noMenu.forEach((item) => {
            item = makePageItem(item, isTree);
            noMenuCate.children.push(item);
        });
        resData.push(noMenuCate);
    }
    return resData;
}

function getCategoryParents(cate) {
    let arr = [];
    function fn(cate) {
        arr.unshift(cate.name);
        if (cate.parent) {
            fn(cate.parent);
        } else {
            return false;
        }
    }
    fn(cate);
    return arr.join(" > ");
}

export {
    makeWebTree,
    getCategoryParents
};