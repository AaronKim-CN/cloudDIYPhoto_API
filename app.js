var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const bodyParser = require('body-parser');

require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require('./routes/testAPI');
var mys3Router = require('./routes/mys3');
var getAlbumsRouter = require('./routes/getalbums');
var getRandomImage = require('./routes/getrandomimage');
var uploadtos3 =  require('./routes/uploadtos3');
var login = require('./routes/loginapi');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: false,
  type: 'application/x-www-form-urlencoded'
}));
app.use(bodyParser.json({ type: 'application/*+json' }));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testAPIRouter);
app.use('/mys3', mys3Router);
app.use('/getalbums',getAlbumsRouter);
app.use('/getRandomImage',getRandomImage);
app.use('/upload',uploadtos3);
app.use('/login', login);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
