// src/components/LoginForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';

const LoginForm = ({ onUserLogin, onAdminLogin }) => {
  const [email, setEmail] = useState(''); // Changed to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Define strict admin credentials
  const ADMIN_USERNAME = 'admin'; // Keeping this for the dual login check
  const ADMIN_PASSWORD = 'password123'; 

  // Basic email validation regex (for frontend check only)
  const isValidEmail = (input) => /\S+@\S+\.\S+/.test(input);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // --- 1. STRICT ADMIN CHECK ---
    if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onAdminLogin(); // Notify App.jsx
      navigate('/form-library'); 
      return;
    } 
    
    // --- 2. GENERIC USER CHECK (Any valid input) ---
    // If the input looks like an email and both fields are filled, allow generic access.
    if (isValidEmail(email) && password.length > 0) {
      onUserLogin(); // Notify App.jsx
      navigate('/form-library');
      return;
    }

    // --- 3. FAILURE ---
    setError('Please enter a valid email and password.');
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-blue-600 max-w-sm mx-auto my-12">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center justify-center">
        <FaSignInAlt className="mr-3 text-blue-600" /> User Login
      </h2>
      
      {error && (
        <div className="p-3 mb-4 text-sm font-medium text-red-800 rounded-lg bg-red-50 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., user@example.com"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
        >
          <FaSignInAlt className="mr-2" /> Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;