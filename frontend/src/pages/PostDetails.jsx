import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MoreVertical } from 'lucide-react';
import LikeComponent from '../components/LikeComponent';
import CommentComponent from '../components/CommentComponent';
import Api from '../api/api';
const PostDetails = () => {
  const { id } = useParams(); // Get post ID from the URL
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Reference to the dropdown for detecting outside clicks

  const [post, setPost] = useState(null); // State to store post data
  const [showActions, setShowActions] = useState(false); // Toggle post actions (edit/delete)

  const currentUserId = useSelector((state) => state.auth.user?._id); // Get logged-in user ID
  const token = localStorage.getItem('token'); // Get auth token from local storage

  // Fetch post data from the backend
  const fetchPost = async () => {
    try {
      const res = await Api.get(`/posts/${id}`);
      setPost(res.data.data);
    } catch (err) {
      console.error('Error fetching post details:', err);
    }
  };

  useEffect(() => {
    fetchPost(); // Call fetch function when component mounts or ID changes
  }, [id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle post deletion
  const handleDeletePost = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await Api.delete(`/posts/delete-post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/'); // Redirect to home after deletion
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  // Show loading state while fetching post
  if (!post) {
    return <div className="text-center mt-10 text-gray-600">Loading post details...</div>;
  }

  // Check if the logged-in user is the post owner
  const isOwner = currentUserId === post.user?._id;

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10 bg-white shadow rounded relative">
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
      >
        Back
      </button>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3" onClick={() => navigate(`/user/${post.user?._id}`)}>
          <img
      src={
  post.user?.profilepicture
    ? `https://social-nest-1-flyx.onrender.com${post.user.profilepicture}`
    : "/default-profile.png"
}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <div className="font-semibold text-gray-800">{post.user?.username}</div>
            <div className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowActions((prev) => !prev)}
              className="text-gray-700 hover:text-black p-2 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="w-6 h-6" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowActions(false);
                    navigate(`/edit-post/${post._id}`);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Edit Post
                </button>
                <button
                  onClick={handleDeletePost}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-2 text-purple-700">{post.caption}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.image && (
        <img
       src={`https://social-nest-1-flyx.onrender.com${post.image}`}
          alt="Post"
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <div>
       
       
        <div className='flex flex-row justify-between'>
          <LikeComponent post={post} />
           <div>
           <span className="text-sm text-gray-500">
          {post.comments?.length || 0} comments
        </span>

        </div>
        </div>
        <CommentComponent postId={post._id} />

      </div>


    </div>
  );
};

export default PostDetails;
