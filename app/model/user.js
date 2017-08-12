/**
 * Created by Administrator on 2017/7/10 0010.
 */
const mongoose = require('mongoose');
const userSchema = require('../schema/user.js');
let user = mongoose.model('User',userSchema);
module.exports = user;