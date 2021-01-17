const username = 'your db user name'; // 如无登录验证则为空
const password = 'your password';
const dbName = 'node-vue-moba'; // 数据库名称
const host = '127.0.0.1';
const port = '27017';

module.exports = {
    dbConnectUrl: 'mongodb://' + ((username && password) ? (username + ':' + password + '@') : '') + host + ':' + port + '/' + dbName
};