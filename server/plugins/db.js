module.exports = app => {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
		useFindAndModify: false
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, '数据库连接失败'));
    db.once('open', ()=> {console.log('数据库连接成功');})
};