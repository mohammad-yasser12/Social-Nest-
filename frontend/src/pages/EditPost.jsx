import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editCaption, setEditCaption] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:3039/api/posts/${id}`);
        const { caption, content, image } = res.data.data;

        setEditCaption(caption);
        setEditContent(content);
        setImagePreview(`http://localhost:3039/uploads/${image}`);
      } catch (err) {
        console.error('Error fetching post details for edit:', err);
      }
    };
    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePost = async () => {
    try {
      const formData = new FormData();
      formData.append('caption', editCaption);
      formData.append('content', editContent);
      if (editImage) formData.append('image', editImage);

      await axios.put(
        `http://localhost:3039/api/posts/edit-post/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      navigate(`/post/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>

      <input
        type="text"
        className="w-full border p-2 mb-2 rounded"
        value={editCaption}
        onChange={(e) => setEditCaption(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded mb-2"
        rows={4}
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Post preview"
          className="w-full h-auto mb-4 rounded"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      <div className="flex gap-2">
        <button
          onClick={handleUpdatePost}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => navigate(`/post/${id}`)}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditPost;
