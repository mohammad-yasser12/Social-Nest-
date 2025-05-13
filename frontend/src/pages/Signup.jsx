import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [profilepicture, setprofilepicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setprofilepicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (profilepicture) {
        data.append('profilepicture', profilepicture);
      }

      const res = await axios.post('http://localhost:3039/api/auth/signup', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Signup successful! Please login now.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-100 to-purple-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-700">Signup</h2>
        <input
          type="text"
          name="username"
          required
          placeholder="Username"
          onChange={handleChange}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none p-3 mb-4 w-full rounded-xl transition-all"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          onChange={handleChange}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none p-3 mb-4 w-full rounded-xl transition-all"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          onChange={handleChange}
          className="border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none p-3 mb-4 w-full rounded-xl transition-all"
        />
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 w-full text-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-3 rounded-xl w-full font-semibold transition-all shadow-md hover:shadow-xl"
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>
        <p className="text-center text-gray-500 mt-4 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
