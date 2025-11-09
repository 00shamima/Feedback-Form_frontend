
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLockOpen } from 'react-icons/fa';

const AdminLoginGate = ({ onAdminLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'password123'; 
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onAdminLogin(); 
      navigate('/admin'); 
    } else {
      setError('Admin credentials required to proceed.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-red-600 max-w-sm mx-auto my-12">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center justify-center text-center">
        <FaUserShield className="mr-3 text-red-600" /> Dashboard Access
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
          Administrator login is required to view analysis and builder tools.
      </p>
      
      {error && (
        <div className="p-3 mb-4 text-sm font-medium text-red-800 rounded-lg bg-red-50 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-red-600 hover:bg-red-700 transition duration-300"
        >
          <FaLockOpen className="mr-2" /> Unlock Dashboard
        </button>
      </form>
    </div>
  );
};

export default AdminLoginGate;