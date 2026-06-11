import express from 'express';
import multer from 'multer';
import { signup, login,getUserProfile
  ,updateProfilePicture,deleteProfilePicture,
  getUserWithPosts,followUser, unfollowUser,getAllUsers,
  getFollowers,getFollowRequests,acceptFollowRequest,
  rejectFollowRequest,getSentRequests,getNotifications,markAsRead,cancelFollowRequest } from '../Controller/authController.js';
  
import { upload } from '../middleware/uploadMiddleware.js';
import {authMiddleware} from '../middleware/authMiddleware.js';


const authRouter = express.Router();


 authRouter.post('/signup', upload.single('profilepicture'), signup);
 authRouter.post('/login', login);
 
 authRouter.get('/users', authMiddleware, getAllUsers);
 authRouter.put(
    '/update-profile-picture/:id',
    authMiddleware,
    upload.single('profilepicture'),
    updateProfilePicture
  );
  authRouter.delete('/delete-profile-picture/:id', authMiddleware, deleteProfilePicture);
  authRouter.get('/count/:id',getUserWithPosts)
  authRouter.get('/user/:id',authMiddleware, getUserProfile);

authRouter.post('/follow/:id', authMiddleware, followUser);
authRouter.post('/unfollow/:id', authMiddleware, unfollowUser);
authRouter.get('/followers/:id', getFollowers);
authRouter.get('/follow-requests', authMiddleware, getFollowRequests);
authRouter.post('/accept-request/:id', authMiddleware, acceptFollowRequest);
authRouter.post('/reject-request/:id', authMiddleware, rejectFollowRequest);
authRouter.post('/cancel-follow/:id', authMiddleware, cancelFollowRequest);

// authRouter.get("/requests", authMiddleware, getFollowRequests);
authRouter.get("/sent-requests", authMiddleware, getSentRequests);
authRouter.get("/notifications", authMiddleware, getNotifications);
authRouter.put("/notifications/read/:id", authMiddleware, markAsRead);
 authRouter.get('/:id', getUserProfile);

export default authRouter;
