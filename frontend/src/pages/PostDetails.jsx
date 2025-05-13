

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MoreVertical, Heart } from 'lucide-react';

const PostDetails = () => {
  const { id } = useParams(); // Get post ID from the URL
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Reference to the dropdown for detecting outside clicks

  const [post, setPost] = useState(null); // State to store post data
  const [showActions, setShowActions] = useState(false); // Toggle post actions (edit/delete)
  const [showLikers, setShowLikers] = useState(false); // Toggle display of users who liked the post
  const [commentInputs, setCommentInputs] = useState({});
  const [postComments, setPostComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});



  const currentUserId = useSelector((state) => state.auth.user?._id); // Get logged-in user ID
  const token = localStorage.getItem('token'); // Get auth token from local storage

  // Fetch post data from the backend
  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:3039/api/posts/${id}`);
      setPost(res.data.data);
    } catch (err) {
      console.error('Error fetching post details:', err);
    }
  };

  useEffect(() => {
    fetchPost(); // Call fetch function when component mounts or ID changes
  }, [id]);

  // Close dropdown or likers list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
        setShowLikers(false);
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
      await axios.delete(`http://localhost:3039/api/posts/delete-post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/'); // Redirect to home after deletion
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = async (postId) => {
    console.log(postId);
    
    const text = commentInputs[postId];
    if (!text) return;

    try {
      const res = await axios.post(
        `http://localhost:3039/api/posts/comment/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setPost(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, comments: [...(p.comments || []), res.data] }
            : p
        )
      );
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };


  // Toggle like or unlike for the post
  const handleLikeToggle = async () => {
    try {
      await axios.put(
        `http://localhost:3039/api/posts/like/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPost(); // Refresh post data to update like count
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Show loading state while fetching post
  if (!post) {
    return <div className="text-center mt-10 text-gray-600">Loading post details...</div>;
  }

  // Check if the logged-in user is the post owner
  const isOwner = currentUserId === post.user?._id;

  // Check if the current user has liked the post
  const hasLiked = post.likes.includes(currentUserId);

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10 bg-white shadow rounded relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
      >
        Back
      </button>

      {/* User Info Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3" onClick={() => navigate(`/user/${post.user?._id}`)}>
          <img
            src={
              post.user?.profilepicture
                ? `http://localhost:3039${post.user.profilepicture}`
                : '/default-profile.jpg'
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

        {/* Edit/Delete Dropdown for Post Owner */}
        {isOwner && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowActions((prev) => !prev)}
              className="text-gray-700 hover:text-black p-2 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="w-6 h-6" />
            </button>

            {/* Dropdown Options */}
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

      {/* Post Caption */}
      <h2 className="text-2xl font-bold mb-2 text-purple-700">{post.caption}</h2>

      {/* Post Content */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Post Image */}
      {post.image && (
        <img
          src={`http://localhost:3039${post.image}`}
          alt="Post"
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      {/* Like Button & Count */}
      <div className='flex flex-row justify-start align-middle gap-6'>
        <div className="flex items-center gap-4 mt-4">


          <button
            onClick={() => handleLikeToggle(post._id)}
            className={`text-xl ${hasLiked ? 'text-blue-500' : 'text-gray-400'}`}
          >
            {hasLiked ? '💙' : '🤍'} Like
          </button>

          {/* Show Likers Count */}
          <button
            onClick={() => setShowLikers((prev) => !prev)}
            className="text-sm text-blue-600 mt-1 "
          >
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </button>


        </div>
        <div className='mt-4 '>
          <button
            onClick={() =>
              setShowCommentInput((prev) => ({
                ...prev,
                [post._id]: !prev[post._id],
              }))
            }
            className="text-blue-500 text-md mt-2"
          >
            💬 Comment
          </button>
          {showCommentInput[post._id] && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInputs[post._id] || ''}
                onChange={(e) =>
                  handleCommentInputChange(post._id, e.target.value)
                }
                className="border rounded px-2 py-1"
              />
              <button
                onClick={() => handleCommentSubmit(post._id)}
                className="text-blue-500  text-lg ml-2 rounded-xl border-4 "
              >
                Post Comment
              </button>
              <div>
                <p>{post.comment}</p>
              </div>
            </div>
            
          )}

        </div>



      </div>



    </div>
  );
};

export default PostDetails;
