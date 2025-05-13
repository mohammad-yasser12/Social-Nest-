import Post from '../Model/postModel.js';
import Comment from '../Model/commentModel.js';
import User from '../Model/userModel.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

export const upload = multer({ storage: storage });

export const createPost = async (req, res) => {
  try {
    const { caption, content } = req.body;
    const image = req.file?.filename;

    if ( !image) {
      return res.status(400).json({ success: false, message: ' image is required' });
    }
  //  const userId = req.user.user_id;

  //  const userObjectId = new mongoose.Types.ObjectId(userId);
    const newPost = await Post.create({
      caption,
      content,
      image: `/uploads/${image}`,
      user: req.user.user_id,
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost,
    });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate('likes', 'username profilePicture') 
  .populate('user', 'username profilepicture email')
  .populate({
    path: 'comments',
    populate: {
      path: 'user',
      select: 'username profilepicture email',
    },
  })
  .sort({ createdAt: -1 });
 console.log("kitiyaa",posts);
      
    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data: posts,
    });
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


export const getPostById = async (req, res) => {
  try {
      const postId = req.params.id;
      const post = await Post.findById(postId).populate('user', 'username profilepicture');
      if (!post) {
          return res.status(404).json({ success: false, message: 'Post not found' });
      }
      res.status(200).json({ success: true, data: post });
  } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching post', error: err.message });
  }
};


export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { caption, content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete old image if new one is uploaded
    if (req.file) {
      if (post.image) {
        const oldImagePath = path.join('uploads', post.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      post.image = `/uploads/${req.file.filename}`;
     
    }

    post.caption = caption;
    post.content = content;

    await post.save();

    res.status(200).json({
      message: 'Post updated successfully',
      updatedPost: post,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check ownership
    if (post.user.toString() !== req.user.user_id) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    // Delete image from local storage if exists
    if (post.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(post.image));
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err.message);
        } else {
          console.log('Image deleted:', imagePath);
        }
      });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



export const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.user_id; // from JWT middleware

  try {
      const post = await Post.findById(postId);

      if (!post) return res.status(404).json({ message: 'Post not found' });

      const alreadyLiked = post.likes.includes(userId);

      if (alreadyLiked) {
          // Remove like
          post.likes = post.likes.filter(id => id.toString() !== userId);
      } else {
          // Add like
          post.likes.push(userId);
      }

      await post.save();
      res.status(200).json({ message: alreadyLiked ? 'Unliked' : 'Liked', likes: post.likes.length });
  } catch (err) {
      res.status(500).json({ message: 'Error liking post', error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.user.user_id;

    // 1. Create and save the comment
    const newComment = new Comment({
      text,
      user: userId,
      post: postId,
    });

    await newComment.save();

    // 2. Push the comment into Post.comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    // 3. Populate the comment's user before sending it to frontend
    const populatedComment = await Comment.findById(newComment._id).populate(
      'user',
      'username profilepicture email'
    );

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username profilepicture')
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.user_id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Allow only the comment's author to delete
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await Comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.user_id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Only author can update
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUserPosts = async (req, res) => {
  const { id } = req.params;
  const { sort } = req.query;

  try {
    let posts;

    if (sort === 'likes') {
      posts = await Post.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(id) } },
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: { likesCount: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' }
      ]);
    } else if (sort === 'comments') {
      posts = await Post.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(id) } },
        { $addFields: { commentsCount: { $size: '$comments' } } },
        { $sort: { commentsCount: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' }
      ]);
    } else {
      posts = await Post.find({ user: id })
        .sort({ createdAt: -1 })
        .populate('user');
    }

    // Option 1: return directly
    res.status(200).json({ data: posts });

    // Option 2: (if you really need it wrapped)
    // res.status(200).json({ data: posts });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};



export const getLikedUsers = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Debug log for likes
    console.log("Liked User IDs:", post.likes);

    // If no likes, return early
    if (!post.likes || post.likes.length === 0) {
      return res.status(200).json({ users: [] });
    }

    // Convert to ObjectIds if needed
    const likeUserIds = post.likes.map(id => new mongoose.Types.ObjectId(id));

    const likedUsers = await User.find({ _id: { $in: likeUserIds } })
      .select('username profilepicture');

    res.status(200).json({ users: likedUsers });
  } catch (error) {
    console.error("Error fetching liked users:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
