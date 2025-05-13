import express from 'express';
import multer from 'multer';
import { signup, login,getUserProfile,updateProfilePicture,deleteProfilePicture,getUserWithPosts } from '../Controller/authController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {authMiddleware} from '../middleware/authMiddleware.js';


const authRouter = express.Router();


 authRouter.post('/signup', upload.single('profilepicture'), signup);
 authRouter.post('/login', login);
 authRouter.get('/:id', getUserProfile); 
 authRouter.put(
    '/update-profile-picture/:id',
    authMiddleware,
    upload.single('profilepicture'),
    updateProfilePicture
  );
  authRouter.delete('/delete-profile-picture/:id', authMiddleware, deleteProfilePicture);
  authRouter.get('/count/:id',getUserWithPosts)


export default authRouter;
