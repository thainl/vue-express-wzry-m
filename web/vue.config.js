const { resolve } = require('path');
module.exports = {
    outputDir: __dirname + '/../server/web',
    // publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    configureWebpack: {
        resolve: {
            modules: [resolve(__dirname, '../node_modules'), 'node_modules']
        }
    }
};