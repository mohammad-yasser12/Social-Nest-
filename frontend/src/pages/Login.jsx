import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice'; // adjust path
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3039/api/auth/login', formData);

      const { token, user } = res.data;

      // Store one user and token at a time
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set in Redux store
      dispatch(setCredentials({ user, token }));

      alert('Login successful!');
      navigate('/'); // Change as needed
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-700">Login</h2>
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
          className="border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none p-3 mb-6 w-full rounded-xl transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-3 rounded-xl w-full font-semibold transition-all shadow-md hover:shadow-xl"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-gray-500 mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
