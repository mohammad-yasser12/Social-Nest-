// scripts/fixImagePaths.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../Model/postModel.js'; // adjust path if needed

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const posts = await Post.find();

    for (let post of posts) {
      if (post.image?.startsWith('/uploads/')) {
        post.image = post.image.replace('/uploads/', '');
        await post.save();
        console.log(`✅ Fixed image path for post: ${post._id}`);
      }
    }

    console.log('🎉 All image paths cleaned!');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
