import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!caption || !image) {
      setError('Caption and image are required');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('content', content);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      console.log("reacttoken",token);
      
      const res = await axios.post('http://localhost:3039/api/posts/create-post', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
         
        }
      });

      setSuccessMsg('Post created successfully!');
      setCaption('');
      setContent('');
      setImage(null);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Create Post</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {successMsg && <p className="text-green-500 mb-3">{successMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Caption</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content (optional)</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

