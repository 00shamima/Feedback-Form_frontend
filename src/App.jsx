import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import FeedbackForm from './Components/FeedbackForm';
import CustomFeedbackForm from './Components/CustomFeedbackForm';
import AdminDashboard from './Components/AdminDashboard';
import LoginForm from './Components/LoginForm';
import AdminLoginGate from './Components/AdminLoginGate'; 
import FormLibrary from './Components/FormLibrary'; 
import './index.css';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // New state for generic user
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleUserLogin = () => setIsUserLoggedIn(true);
  const handleAdminLogin = () => setIsAdminLoggedIn(true);
  
  const handleLogout = () => {
    setIsUserLoggedIn(false);
    setIsAdminLoggedIn(false);
  }

  const AdminRoute = ({ children }) => {
    return isAdminLoggedIn ? children : <Navigate to="/admin-login" replace />; 
  };

  return (
    <Router>
      <header className="bg-gray-900 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link to={isUserLoggedIn || isAdminLoggedIn ? "/form-library" : "/login"} 
                  className="text-lg sm:text-xl font-extrabold text-white tracking-wider hover:text-green-400 transition duration-300">
              Feedback survey App
            </Link>
            
            <Link to="/form-library" className="text-xs sm:text-sm text-gray-300 hover:text-white transition duration-200">
                Form Library
            </Link>
            
            <Link to="/admin-login" className="text-xs sm:text-sm text-gray-300 hover:text-red-400 transition duration-200">
              Admin Dashboard
            </Link>
          </div>
          <div>
            {(isUserLoggedIn || isAdminLoggedIn) ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-4 rounded-md transition duration-200 text-xs sm:text-sm"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-md transition duration-200 text-xs sm:text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="min-h-screen bg-gray-100 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         <Routes>

  <Route path="/" element={<Navigate to="/login" replace />} />

  <Route path="/login" element={<LoginForm onUserLogin={handleUserLogin} onAdminLogin={handleAdminLogin} />} />

  <Route 
    path="/form-library" 
    element={isUserLoggedIn || isAdminLoggedIn ? <FormLibrary /> : <Navigate to="/login" replace />} 
  />

  <Route path="/survey/:topic" element={<FeedbackForm />} />
  <Route path="/survey/custom-:uniqueFormId" element={<CustomFeedbackForm />} />

  <Route 
    path="/admin-login" 
    element={<AdminLoginGate onAdminLogin={handleAdminLogin} />} 
  />

  <Route 
    path="/admin" 
    element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    } 
  />
  
  {/* Fallback route for any unmatched URL */}
  <Route path="*" element={<Navigate to="/form-library" replace />} />

</Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;