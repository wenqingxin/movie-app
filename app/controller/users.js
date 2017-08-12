var express = require('express');
var router = express.Router();
var Movie = require('../model/movie')
var User = require('../model/user')
var Comment = require('../model/comment')

router.get('/showSignin',function (err,res) {
    res.render('pages/signin')
});
router.get('/showSignup',function (err,res) {
    res.render('pages/signup')
});
router.post('/signup',function (req,res,next) {
    let name = req.body.name;
    let password = req.body.password;
    let _user = new User({
        name,
        password
    });
    User.find({name},function (err,user) {
        if(err) console.log(err);
        if(user && user.length>0){
            return res.redirect('/')
        }else{
            _user.save(function (err,user) {
                if(err) console.log(err);
                res.redirect('/admin/userlist')
            })
        }
    })
    console.log(name,password);
});

router.post('/signin',function (req,res) {
    let name = req.body.name;
    let password = req.body.password;
    User.findOne({name},function (err,user) {
        if(err) console.log(err);
        if(!user){
            console.log("User doesn't exist");
            return res.redirect('/');
        }
        user.comparePassword(password,function (err,isMatch) {
            if(err) console.log(err);
            if(isMatch){
                console.log('Login success');
                req.session.user = user;
                return res.redirect('/');
            }else{
                console.log('Password is not match');
                return res.redirect('/');

            }
        });
    })
});

router.get('/movie/:id',function (req,res,next) {
    let id = req.params.id;
    Movie.update({_id:id},{$inc:{pv:1}},function (err) {
        if(err) console.log(err);
    });
    Movie.findById(id,function (err,movie) {
        Comment.find({movie:id})
            .populate('from','name')
            .populate('reply.from reply.to','name')
            .exec(function (err,comment) {
                console.log('评论结果',comment)
                res.render('pages/detail',{
                    title:'详情页',
                    movie,
                    comment
                });
            })
    })
});

router.use(function (req,res,next) {
    let user = req.session.user;
    if(!user){
        return res.redirect('/users/showSignin')
    }
    next();
});
/* GET users listing. */

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/logout',function (req,res) {
    delete req.session.user;
    res.redirect('/');
});
//comment
router.post('/comment',function (req,res) {
    let movieId = req.body.movieId;
    let fromUserId = req.body.fromUserId;
    //let toUserId = req.body.toUserId;
    if(req.body.cid){
        Comment.findById(req.body.cid,function (err,comment) {
            if(err) console.log('评论失败',err);
            let reply={
                from:fromUserId,
                to:req.body.tid,
                content:req.body.content
            }
            comment.reply.push(reply);
            comment.save(function (err,commoent) {
                res.redirect('/users/movie/'+movieId);
            });
        })
    }else{
        let content = req.body.content;
        let comment = new Comment({
            movie:movieId,
            from:fromUserId,
            //to:toUserId,
            content:content,
        });
        comment.save(function (err,comment) {
            if(err) console.log('评论失败',err);
            res.redirect('/users/movie/'+movieId);
        })
    }
});
module.exports = router;
/**
 * {
      title: '电影详情',
      movie: {
        director: '雷德利·斯科特',
        country: '美国',
        title: '异形：契约',
        year: 2017,
        poster: 'https://img3.doubanio.com/img/celebrity/small/32214.jpg',
        language: '英语',
        flash: 'http://static.youku.com/v20170420.0/v/custom/upsplayer/player.swf',
        summary:'“科幻之父”雷德利-斯科特将为他所开创的《异形》系列带来新篇章。《异形：契约》的故事发生在《普罗米修斯》10年后，一群新的宇航员乘坐着“契约号”飞船前往遥远的星系寻找殖民地，他们来到一处看似天堂般的星球，实则是黑暗、危险的地狱，在那里他们见到了“普罗米修斯”号唯一的幸存者——由迈克尔·法斯宾德饰演的生化人大卫，一场毁灭性的巨大灾难即将到来。'
      }
    }
 */