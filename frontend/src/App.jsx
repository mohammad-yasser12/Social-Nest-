import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import UserProfile from './pages/UserProfile';
import EditPost from './pages/EditPost';
import EditProfilePicture from './pages/EditProfilePicture';
import EditComment from './pages/EditComment';
import LikeComponent from "./components/LikeComponent";
import CommentComponent from './components/CommentComponent';
import Navbar from './components/Navbar';
import FindFriends from './pages/FindFriends';
import FollowRequests from './pages/FollowRequests';
import MessagesWrapper from './pages/MessageWrapper';
import Inbox from "./pages/Inbox";



function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "undefined" && token !== "null";

  return (
    <BrowserRouter>
     {isAuthenticated && <Navbar />}
      <Routes>
        {/* Redirect based on login status */}
        <Route
  path="/"
  element={
    isAuthenticated ? <Home /> : <Navigate to="/signup" replace />
  }
/>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Other routes (you can keep protected or open for now) */}
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/edit-profile-picture/:id" element={<EditProfilePicture />} />
        <Route path="/posts/update/:commentId" element={<EditComment />} />
        <Route path="/user_list/:id" element={< FindFriends />} />
        <Route path="/follow-requests" element={< FollowRequests />} />
        <Route path="/messages/:conversationId" element={<MessagesWrapper />} />
      
        <Route path="/messages" element={<Inbox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

