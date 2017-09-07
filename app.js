var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

/*
var logger = require('express-logger');
*/
var mode = process.env.NODE_ENV || 'development';
console.log(mode)
var mongoStore = require('connect-mongo')(session);
const dbUrl = mode === 'development'? "mongodb://127.0.0.1:27017/movie" : 'mongodb://movie_rw:13370761096@127.0.0.1:27017/movie';
console.log(dbUrl)
mongoose.connect(dbUrl);

mongoose.Promise = global.Promise;
var index = require('./app/controller/index');
var users = require('./app/controller/users');
var admin = require('./app/controller/admin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret:'wenqingxin',
    resave:true,
    //持久化
    store:new mongoStore({
        url:dbUrl,
        collection:'sessions'
    })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'bower_components')));
app.use(function(req, res, next) {
    //存到本地变量，页面直接能拿到
    app.locals.user = req.session.user;
    next();
});
app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

if('development' === app.get('env')){
    console.log('development mode')
    app.set('showStackError',true);
    app.use(logger(':method:url:status'));
    //模板不压缩
    app.locals.pretty = true;
    mongoose.set('debug','true');

}
//我就试试
module.exports = app;
