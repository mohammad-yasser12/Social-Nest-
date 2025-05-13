import express from 'express';
import { createPost, getAllPosts,getPostById,likePost,addComment, getCommentsByPost,updatePost,deletePost,updateComment,deleteComment,getUserPosts,getLikedUsers} from '../Controller/postController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const postRouter = express.Router();

  

postRouter.post('/create-post', authMiddleware, upload.single('image'), createPost);
postRouter.get('/all-posts', getAllPosts);
postRouter.get('/:id',getPostById)
postRouter.put('/like/:id', authMiddleware, likePost);
postRouter.post('/comment/:postId', authMiddleware, addComment);
postRouter.get('/comments/:postId', getCommentsByPost);
postRouter.delete('/delete/:commentId', authMiddleware, deleteComment);
postRouter.put('/update/:commentId', authMiddleware, updateComment);

// PUT - Update Post

postRouter.put('/edit-post/:id',authMiddleware, upload.single('image'), updatePost);


// DELETE - Delete Post
postRouter.delete('/delete-post/:id', authMiddleware, deletePost);

postRouter.get('/user/:id',authMiddleware, getUserPosts);
postRouter.get('/likes/:postId', authMiddleware, getLikedUsers);




export default postRouter;










  

