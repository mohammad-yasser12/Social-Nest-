import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '', // Optional longer post content
  },
  image: {
    type: String, // File path or image URL
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ Important for populate
    required: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],


  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Post = mongoose.model('Post', postSchema);
export default Post;
