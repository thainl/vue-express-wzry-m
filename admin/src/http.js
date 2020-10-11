import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:2887/admin/api'
})

export default http;