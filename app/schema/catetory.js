/**
 * Created by Administrator on 2017/7/2 0002.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
//模式
const catetorySchema = new mongoose.Schema({
    name:String,
    movies:[{type:ObjectId,ref:'Movie'}],
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});
//每次存储都调用
catetorySchema.pre('save',function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});
//增加静态方法 相当于dao层
catetorySchema.statics = {
    fetch:function (cb) {
        return this.find({}).exec(cb);
    },
    findById:function (id,cb) {
        return this.findOne({
            _id:id
        }).
        exec(cb);
    },
}

module.exports = catetorySchema;