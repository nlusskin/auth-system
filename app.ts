import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';

import authUser from './lib/auth'

import indexRouter from './routes/index';
import authRouter from './routes/authenticate';
import logoutRouter from './routes/logout';
import welcomeRouter from './routes/welcome';
import settingsRouter from './routes/settings'

dotenv.config()
const PORT = process.env.PORT;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// authenticate user when accessing protected resources
app.use(authUser);

// available application routes
app.use('/', indexRouter);
app.use('/authenticate', authRouter);
app.use('/logout', logoutRouter);
app.use('/welcome', welcomeRouter);
app.use('/settings', settingsRouter);

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


export default app;
