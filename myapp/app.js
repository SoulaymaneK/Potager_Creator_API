var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key_here',
  resave: false, // Set to false to prevent session saving on every request
  saveUninitialized: false // Set to false to prevent saving uninitialized sessions
}));

// Middleware pour vérifier si la session est active
function checkSession(req, res, next) {
  if (req.session && req.session.user) {
      // Si la session est active, passer à la prochaine étape
      next();
  } else {
      // Si la session n'est pas active, rediriger vers '/'
      res.redirect('/');
  }
}

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use(checkSession);
app.use('/users', usersRouter);


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
