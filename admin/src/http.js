import axios from 'axios';
import Vue from 'vue';

const http = axios.create({
    baseURL: 'http://localhost:2887/admin/api'
})

// 响应拦截
http.interceptors.response.use(res => {
    return res;
}, err => {
    // 状态码大于等于400都会被处理
    if(err.response.data.msg) {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.msg
        })
    }
    return Promise.reject(err);
})

export default http;