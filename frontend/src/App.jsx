import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import UserProfile from './pages/UserProfile';
import EditPost from './pages/EditPost';
import EditProfilePicture from './pages/EditProfilePicture';
import EditComment from './pages/EditComment';







function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/edit-profile-picture/:id" element={<EditProfilePicture />} />
        <Route path="/posts/update/:commentId" element={<EditComment />}   />
                            
            


       
      </Routes>
    </BrowserRouter>
  );
}

export default App;

