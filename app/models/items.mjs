import mongoose from 'mongoose';
import User from '../models/user';

const ItemsSchema = new mongoose.Schema({
  categoryId: Number,
  parentId: Number,
  authorId: String,
  isActive: Boolean,
  isModerated: Boolean,
  title: {
    type: String,
    // required: true,
  },
  description: String,
  price: {
    type: Number,
    // required: true,
  },
  images: Array,
  place: String,
  infoAuthor: {
    id: String,
    username: String,
    email: String,
    avatar: String,
    phone: String
  }
}, {
    timestamps: true
  });

ItemsSchema.methods.responseItem = function(user) {
  // return {
  //   title: this.title,
  //   description: this.description,
  //   body: this.body,
  //   createdAt: this.createdAt,
  //   updatedAt: this.updatedAt,
  //   tagList: this.tagList,
  //   favorited: user ? user.isFavorite(this._id) : false,
  //   favoritesCount: this.favoritesCount,
  //   author: this.author.toProfileJSONFor(user)
  // };
};
export default mongoose.model('Items', ItemsSchema);