import mongoose from 'mongoose';

const CategoriesSchema = new mongoose.Schema({
  categoryId: {
    type: Number,
    required: true,
  },
  parentId: Number,
  codeName: String,
  name: String
});

export default mongoose.model('Categories', CategoriesSchema);