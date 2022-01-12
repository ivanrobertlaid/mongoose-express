import passport from 'passport';
import localStrategy from 'passport-local';
import mongoose from 'mongoose';
import facebookStrategy from 'passport-facebook';

const User = mongoose.model('User');
const LocalStrategy = localStrategy.Strategy;
const FacebookStrategy = facebookStrategy.Strategy;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  User.findOne({ email: email })
    .then((user) => {
      if (!user || !user.validPassword(password)) {
        return done(null, false, {success: false, error: {status: 422} ,message: 'email or password is invalid'});
      }

      return done(null, user, {user, success: true});
    })
    .catch(done);
}));


passport.use(new FacebookStrategy({
  clientID: '123', // FACEBOOK_APP_ID,
  clientSecret: '213', //FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      console.log(profile);

      return done(null, profile);
    });
  }
));

export default passport;