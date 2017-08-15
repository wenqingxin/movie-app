var express = require('express');
var router = express.Router();
var Movie = require('../model/movie')
var Catetory = require('../model/catetory')
var app = require('../../app.js')
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('user in session:');
  console.log(req.session.user);
    Catetory.find({})
        .populate({path:'movies',options:{limit:6}}).sort({'meta.createAt':-1})
        .exec(function (err,catetories) {
            if(err){
                console.log(err);
            }
            res.render('pages/index',{
                title:'电影首页',
                catetories
            });
        });
});

router.get('/result',function (req,res,next) {
    let catId = req.query.cat;
    let page = parseInt(req.query.p,10) || 1;
    let index =(page-1)*2;
    let q = req.query.q;
    if(catId){
        Catetory.find({_id:catId})
            .populate({
                path:'movies',
                select:'title poster',
                //options:{limit:2,skip:index}
            })
            .exec(function (err,cart) {
                let results = cart[0].movies.slice(index,index+2)
                if(err){
                    console.log(err);
                }
                res.render('pages/results',{
                    title:'结果列表页',
                    keyword:cart[0].name,
                    currentPage:Number(page),
                    query:'cat='+catId,
                    totalPage:Math.ceil(cart[0].movies.length/2),
                    movies:results
                })
            })

    }else{
        Movie.find({title:new RegExp(q+'.*','i')})
            .exec(function (err,movies) {
                if(err){
                    console.log(err);
                }
                let results = movies.slice(index,index+2)

                res.render('pages/results',{
                    title:'结果列表页',
                    keyword:q,
                    currentPage:Number(page),
                    query:'q='+q,
                    totalPage:Math.ceil(movies.length/2),
                    movies:results
                })
            })
    }
});
module.exports = router;
/*
{// 调用当前路径下的 test.jade 模板
  title: '电影网站首页',
    movies: [{
  title: '异形：契约',
  _id: 1,
  poster: 'https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2167448161.webp'
},
  {
    title: '异形：契约',
    _id: 2,
    poster: 'https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2167448161.webp'
  },
  {
    title: '异形：契约',
    _id: 3,
    poster: 'https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2167448161.webp'
  },
  {
    title: '异形：契约',
    _id: 4,
    poster: 'https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2167448161.webp'
  },
  {
    title: '异形：契约',
    _id: 5,
    poster: 'https://img3.doubanio.com/view/movie_poster_cover/ipst/public/p2167448161.webp'
  }],
}*/
