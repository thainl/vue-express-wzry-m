import axios from 'axios';
import Vue from 'vue';
import router from '../router/index';

const http = axios.create({
    baseURL: process.env.VUE_APP_API_URL || '/admin/api',
})

// 请求拦截
http.interceptors.request.use(req => {
    if(sessionStorage.token) {
        req.headers.Authorization = 'Bearer ' + sessionStorage.token; // Bearer 为一种类型
    }
    // 拦截页面无权限的操作
    const currentRoute = router.currentRoute; // 当前前端路由对象
    const currentRouteRights = currentRoute.meta.rights;
    if(currentRouteRights) {
        let action = req.method.toUpperCase();
        if(/[\s\S]+(search)$/gi.test(req.url.split('?')[0]) && action === 'GET') {
            // 点击搜索按钮操作
            action = 'SEARCH';
        }
        let hasNoPermission = currentRouteRights.indexOf(action) === -1;
        // console.log(currentRouteRights,action, hasNoPermission);
        if(hasNoPermission) {
            Vue.prototype.$alert('无权限进行此操作： ' + action, '错误', {type: 'error'});
            return Promise.reject(new Error('无权限进行此操作'));
        }
    }
    return req;
}, err => {
    return Promise.reject(err);
})

// 响应拦截
http.interceptors.response.use(res => {
    return res;
}, err => {
    // 状态码大于等于400都会被处理
    console.log(err);
    if(err.response.data.msg) {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.msg + ' ' + err.response.status
        })
        if(err.response.status === 401) {
            // 状态码为401，跳转到登录页
            router.push('/login')
        }
    }
    return Promise.reject(err);
})

export default http;