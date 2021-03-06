import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../../config';

const UserSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"]},
  username: String || null,
  avatar: String || null,
  phone: String || null,
  hash: String,
  salt: String,
  token: String,
  items: {
    active: [],
    closed: []
  }
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this.id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, config.db.secret);
};

UserSchema.methods.toAuthJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    avatar: this.avatar,
    items: this.items,
    phone: this.phone
  };
};

UserSchema.methods.toProfileJSONFor = function(user){
  return {
    username: this.username,
    avatar: this.avatar || 'https://static.productionready.io/images/smiley-cyrus.jpg',
  };
};

UserSchema.methods.favorite = function(id){
  if(this.favorites.indexOf(id) === -1){
    this.favorites.push(id);
  }

  return this.save();
};

UserSchema.methods.unfavorite = function(id){
  this.favorites.remove(id);
  return this.save();
};

UserSchema.methods.isFavorite = function(id){
  return this.favorites.some(function(favoriteId){
    return favoriteId.toString() === id.toString();
  });
};

UserSchema.methods.follow = function(id){
  if(this.following.indexOf(id) === -1){
    this.following.push(id);
  }

  return this.save();
};

UserSchema.methods.unfollow = function(id){
  this.following.remove(id);
  return this.save();
};

UserSchema.methods.isFollowing = function(id){
  return this.following.some(function(followId){
    return followId.toString() === id.toString();
  });
};

export default mongoose.model('User', UserSchema);