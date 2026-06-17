// // features/authSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const userFromStorage = JSON.parse(localStorage.getItem('user'));
// const tokenFromStorage = localStorage.getItem('token');

// const initialState = {
//   user: userFromStorage || null,
//   token: tokenFromStorage || null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       const { user, token } = action.payload;
//       state.user = user;
//       state.token = token;

//       localStorage.setItem('user', JSON.stringify(user));
//       localStorage.setItem('token', token);
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;

//       localStorage.removeItem('user');
//       localStorage.removeItem('token');
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;
// features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Safe localStorage parsing
let userFromStorage = null;

try {
  const storedUser = localStorage.getItem('user');

  if (storedUser && storedUser !== "undefined") {
    userFromStorage = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Invalid user in localStorage:", error);
}

const tokenFromStorage = localStorage.getItem('token');

// Initial state
const initialState = {
  user: userFromStorage,
  token: tokenFromStorage || null,
  isAuthenticated: !!tokenFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;