import axios from 'axios';
import Vue from 'vue';
import router from './router/index';

const http = axios.create({
    baseURL: 'http://localhost:2887/admin/api'
})

// 请求拦截
http.interceptors.request.use(config => {
    // console.log(config.url, config.method);
    if(localStorage.token) {
        config.headers.Authorization = 'Bearer ' + localStorage.token; // Bearer 为一种类型
    }
    return config;
}, err => {
    return Promise.reject(err);
})

// 响应拦截
http.interceptors.response.use(res => {
    return res;
}, err => {
    // 状态码大于等于400都会被处理
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