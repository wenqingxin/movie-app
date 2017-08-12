var express = require('express');
var router = express.Router();
const Movie = require('../model/movie')
const User = require('../model/user')
const Catetory = require('../model/catetory')
var multipart = require('connect-multiparty');

var fs = require('fs')
var path = require('path')
router.use(function (req,res,next) {
    let user = req.session.user;
    if(!user){
        return res.redirect('/users/signin')
    }
    if(!user.role || user.role<=10){
        return res.redirect('/')
    }
    next();
});
router.get('/',function (req,res,next) {
    console.log(req.query.id);
    Catetory.fetch(function (err,catetories) {
        if(err) console.log(err)
        let id = req.query.id;
        if(id!=undefined){
            Movie.findById(id,(err,movie)=>{
                console.log('电影'+movie);
                console.log('种类'+catetories);

                res.render('pages/admin',{
                    title: '电影更新',
                    movie,
                    catetories
                });
            });
        }else{
            res.render('pages/admin',{
                title: '电影录入',
                movie: {
                    title: '',
                    director: '',
                    country: '',
                    year: '',
                    poster: '',
                    flash: '',
                    summary: '',
                    language: ''
                },
                catetories
            });
        }
    })
});
router.get('/movie/list',function (req,res,next) {
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err);
        }
        res.render('pages/movielist',{
            title: '电影列表',
            movies
        });
    });

});

router.get('/movie/update/:id',function (req,res) {
    var id = req.param.id;
    if(id){
      Movie.findById(id,function (err,movie) {
          res.render('movie',{
            title:'后台更新页',
            movie
          })
      })
    }
})
router.post('/movie/new',multipart(),function(req,res,next){
    let posterData = req.files.uploadPoster;
    let filePath = posterData.path;
    let oriFileName = posterData.originalFilename;
    if(oriFileName){
        fs.readFile(filePath,function (err,data) {
            if(err) console.log(err)
            let timeStamp = Date.now();
            let type = posterData.type.split('/')[1];
            let poster = timeStamp+'.'+type;
            let newPath = path.join(__dirname,'../../','/public/upload/'+poster);

            fs.writeFile(newPath,data,function (err) {
                if(err) console.log('写入出错'+err)
                console.log('写入数据',data)
                req.poster = poster;
                next();
            })
        })
    }else{
        next();
    }
},function (req,res,next) {
  let id = req.body._id;
  let {country,director,language,summary,title,year,flash,poster,catetory} = req.body;
  let catetoryName= req.body.catetoryName;
  let saveFunc = function (catetoryId,movie) {
      if(catetoryName){
          Catetory.find({name:catetoryName},function (err,catetory) {
              if(catetory && catetory.length>0){
                  movie.catetory = catetory._id;
                  movie.save(function (err,movie) {
                      if(err) console.log(err);
                      res.redirect('/admin/movie/list/')
                  })
              }else{
                  let _catetory = new Catetory({
                      name:catetoryName,
                      movies:[movie._id]
                  });
                  _catetory.save(function (err,catetory) {
                      if(err) console.log(err);
                      movie.catetory = catetory._id;
                      movie.save(function (err,movie) {
                          if(err) console.log(err);
                          res.redirect('/admin/movie/list/')
                      })
                  })
              }
          })

      }else  if(catetory){
          Catetory.findById(catetory,function (err,catetory) {
              catetory.movies.push(movie._id);
              catetory.save(function (err,catetory) {
                  if(err) console.log(err);
                  movie.save(function (err,movie) {
                      if(err) console.log(err);
                      res.redirect('/admin/movie/list/')
                  })
              })
          })
      }
  }
    let movieObj ={country,director,language,summary,title,year,flash,poster,catetory};
    if(req.poster){
        movieObj.poster = req.poster;
    }
    if(id != 'undefined'){
      Movie.findById(id,(err,movie)=>{
        if(err) console.log(err);
         Object.assign(movie,movieObj);
          saveFunc(catetory,movie);
      })
  }else{
    let movie = new Movie(movieObj);

      saveFunc(catetory,movie);
  }
});
router.post('/movie/catetory/new',function (req,res,next) {
    let name = req.body.name;
    let id = req.body.id;
    if(id){
        Catetory.findById(id,function (err,catetory) {
            catetory.name=name;
            catetory.save(function (err,catetory) {
                res.redirect('/admin/movie/catetory/list');
            });
        });
    }else{
        let catetory=new Catetory({name});
        catetory.save(function (err,catetory) {
            if(err){
                console.log(err);
            }
            res.redirect('/admin/movie/catetory/list');
        });
    }
});
router.get('/movie/catetory',function (req,res,next) {
    if(req.query.id){
        Catetory.findById(req.query.id,function (err,catetory) {
            res.render('pages/catetory_admin',{
                title:'分类列表类',
                catetory
            });
        })
    }else{
        res.render('pages/catetory_admin',{
            title:'分类列表类',
            catetory:{
                name:''
            }
        });
    }
});
router.get('/movie/catetory/list',function (req,res,next) {
    Catetory.fetch(function (err,catetories) {
        if(err){
            console.log(err);
        }
        res.render('pages/catetorylist',{
            title:'分类列表类',
            catetories
        })
    })
});
router.delete('/movie/delete',function (req,res,next) {
    let id = req.query.id;
    Movie.remove({_id:id},function (err,movie) {
        if(err){
            console.log('删除失败');
            res.json({success:0});
        } else{
            res.json({success:1});
        }

    })
});

router.get('/userlist',function (req,res,next) {
    User.fetch(function (err,users) {
        if(err) console.log(err);
        res.render('pages/userlist',{title:'用户列表',users});
    })
});

module.exports = router;