import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// const token = jwt.sign(
//   { user_id: user._id },
//   process.env.JWT_SECRET,
//   { expiresIn: '7d' },
//   console.log(token)
  
// );