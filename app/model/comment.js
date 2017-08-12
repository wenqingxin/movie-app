/**
 * Created by Administrator on 2017/7/15 0015.
 */
var mongoose = require('mongoose');
var commentSchema = require('../schema/comment');
var comment = mongoose.model('Comment',commentSchema);

module.exports = comment;