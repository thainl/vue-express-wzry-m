const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String  
    },
    parent: {type: mongoose.SchemaTypes.ObjectId, ref: 'Category'}
})

schema.virtual('children', { // 新建一个虚拟字段children
    localField: '_id', // 要用本地的哪个字段进行关联
    ref: 'Category', // 要关联的模型
    foreignField: 'parent', // 外键， 表示要关联模型中的哪个字段进行关联
    justOne: false, // 该虚拟字段的数据是否只有一个
})

module.exports = mongoose.model('Category', schema);