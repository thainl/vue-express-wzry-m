import http from "./http";

async function createResourceItem(model, data) {
    return await http.post("/rest/" + model, data);
}

async function getResourceList(model, page, size, sort, search) {
    // 排序搜索为可选
    return await http.get(
        `/rest/${model}?page=${page}&size=${size}${
            (sort ? "&sort=" + sort : "") + (search ? "&search=" + search : "")
        }`
    );
}

async function getResourceSimpleList(model) {
    return await http.get('/rest/' + model + '/selectlist');
}

async function deleteResourceItem(model, id) {
    if (!id) throw new Error("要删除的id不能为空");
    return await http.delete("/rest/" + model + "/" + id);
}

async function deleteResources(model, arr) {
    if (!Array.isArray(arr)) return;
    return await http({
        method: 'delete',
        url: "/rest/" + model,
        data: arr
    });
}

async function getResourceItem(model, id) {
    return await http.get("/rest/" + model + "/" + id);
}

async function updateResourceItem(model, id, data) {
    return await http.put("/rest/" + model + "/" + id, data);
}

async function adminUserLogin(data) {
    return await http.post('/login', data);
}

async function getLoginUserInfo() {
    return await http.get('/user_info');
}

async function uploadImage(data) {
    return await http.post('/upload', data);
}

export {
    createResourceItem,
    getResourceList,
    getResourceSimpleList,
    deleteResourceItem,
    deleteResources,
    getResourceItem,
    updateResourceItem,
    adminUserLogin,
    getLoginUserInfo,
    uploadImage,
};