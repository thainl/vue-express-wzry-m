const { resolve } = require('path');
module.exports = {
    configureWebpack: {
        resolve: {
            modules: [resolve(__dirname, '../node_modules'), 'node_modules']
        }
    }
};