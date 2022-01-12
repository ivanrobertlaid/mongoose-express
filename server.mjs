import config from './config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './app/routes';
import passport from 'passport';
import session from 'express-session';
import adminBro from './config/admin';
import './config/passport';

const app = express();

mongoose.connect( config.db.connection, config.db.options );
mongoose.set('debug', true);

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// all images
app.use('/uploads', express.static('uploads'));
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// add session and passport setting
app.use(session({
  secret: 'nodejs-passport-facebook-example',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// admin panel routes
app.use(adminBro.adminBro.options.rootPath, adminBro.adminRouter);

// api routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const error = {
    error: err,
    code: err.status,
    success: false
  }

  res.json(error);
});

// passport setting
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

import './config/passport';


// listen to server
app.listen( config.PORT || 3000, () => console.log(config.listen));