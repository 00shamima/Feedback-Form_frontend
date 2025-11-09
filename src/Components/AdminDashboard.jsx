import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaClipboardCheck, FaChartBar } from 'react-icons/fa'; 

// Use environment variable for the base URL
const BASE_API_URL = import.meta.env.VITE_BACKEND_API_URL;
const FEEDBACK_ENDPOINT = '/api/feedback'; 
const API_URL = `${BASE_API_URL}${FEEDBACK_ENDPOINT}`;

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []); 

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      
      // FIX: Using the combined API_URL for GET
      const response = await axios.get(API_URL);
      
      const processedFeedbacks = response.data.map(f => ({
          ...f,
          // Ensure answers are parsed if they are stored as JSON strings
          answers: (typeof f.answers === 'string') ? JSON.parse(f.answers) : f.answers
      }));

      setFeedbacks(processedFeedbacks); 
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Ensure your backend is running and the API key is correct.');
      console.error("Axios Error fetching feedback:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, topic, name) => {
    if (!window.confirm(`Are you sure you want to delete the feedback from ${name} about ${topic}?`)) {
        return;
    }
    try {
      // FIX: Using template literal for DELETE
        await axios.delete(`${API_URL}/${id}`);
        fetchFeedbacks(); 
    } catch (err) {
        console.error("Deletion Error:", err);
        alert("Failed to delete feedback. Check server console.");
    }
  };

  const statistics = useMemo(() => {
    if (feedbacks.length === 0) {
      return { total: 0, avgRating: 0, recommendPercent: 0, topicCounts: {} };
    }
    // ... statistics logic remains the same ...
    const total = feedbacks.length;
    let totalRating = 0;
    let recommendCount = 0;
    const topicCounts = {};

    feedbacks.forEach((feedback) => {
      const answers = feedback.answers || {}; 
      const rating = Number(answers.rating); 
      if (!isNaN(rating)) {
        totalRating += rating;
      }
      if (answers.recommend === 'Yes') {
        recommendCount++;
      }
      const topicName = answers.topic || 'Unknown Topic';
      topicCounts[topicName] = (topicCounts[topicName] || 0) + 1;
    });

    const avgRating = (totalRating / total).toFixed(2);
    const recommendPercent = ((recommendCount / total) * 100).toFixed(0);

    return { total, avgRating, recommendCount, recommendPercent, topicCounts };
  }, [feedbacks]);

  
  if (loading) return <p className="text-xl text-center py-10 text-gray-600">Loading feedback data...</p>;
  if (error) return <p className="text-xl text-center py-10 text-red-600 border border-red-300 p-4 rounded-lg">❌ Error: {error}</p>;


  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
        {/* ... JSX remains the same ... */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4 flex items-center">
            <FaChartBar className="mr-3 text-indigo-600" /> Feedback Analysis Dashboard
        </h2>

        <div className="flex justify-between items-start mb-6 flex-wrap bg-gray-900 p-6 rounded-xl text-white shadow-xl">
            <h2 className="text-3xl font-extrabold mb-4 sm:mb-0">Campaign Overview</h2>
            <div className="text-right">
                <p className="text-sm font-semibold text-green-400">ADMIN OVERVIEW</p>
                <p className="text-xl font-bold">Avg. Rating: {statistics.avgRating} / 5</p>
                <p className="text-sm">Total Submissions: {statistics.total}</p>
            </div>
        </div>
        
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-indigo-50 p-6 rounded-xl shadow-lg text-center border-b-4 border-indigo-500">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Topics</h3>
                <h1 className="text-5xl font-extrabold text-indigo-700">{Object.keys(statistics.topicCounts).length}</h1>
            </div>
            <div className="bg-green-50 p-6 rounded-xl shadow-lg text-center border-b-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Average Rating</h3>
                <h1 className="text-5xl font-extrabold text-green-700">{statistics.avgRating} / 5</h1>
            </div>
            <div className="bg-teal-50 p-6 rounded-xl shadow-lg text-center border-b-4 border-teal-500">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Recommendation Rate</h3>
                <h1 className="text-5xl font-extrabold text-teal-700">{statistics.recommendPercent}%</h1>
            </div>
            
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Feedback Records by Topic</h3>
        
        
        <div className="space-y-6">
            {feedbacks.length === 0 ? (
                <p className="text-center italic text-gray-500 pt-4"><FaClipboardCheck className="inline mr-2" /> No feedback has been submitted yet.</p>
            ) : (
                Object.entries(statistics.topicCounts).map(([topic, count]) => (
                    <div key={topic} className="bg-gray-100 p-4 rounded-xl shadow-lg border-l-4 border-gray-500">
                        <h4 className="text-xl font-bold text-gray-800 mb-3">{topic} ({count} Submissions)</h4>
                        {feedbacks
                            .filter(f => (f.answers.topic || 'Unknown Topic') === topic)
                            .map((feedback) => (
                                <div key={feedback.id} className="border border-gray-200 p-3 rounded-lg bg-white shadow-sm mb-2 hover:shadow-md transition flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center mb-1 text-sm flex-wrap">
                                            <p className="font-semibold text-gray-700">{feedback.answers.name || 'Anonymous'}</p>
                                            
                                            {feedback.answers.courseName && (
                                                <span className="ml-3 px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700 hidden sm:inline-block">
                                                    ID: {feedback.answers.courseName}
                                                </span>
                                            )}
                                            
                                            <span className={`ml-3 px-2 py-0.5 text-xs font-bold rounded ${feedback.answers.rating >= 4 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                Rating: {feedback.answers.rating || 'N/A'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm italic break-words">
                                          **Comments:** {feedback.answers.comments || "*No comment*"}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(feedback.id, topic, feedback.answers.name)}
                                        className="text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-full hover:bg-red-100 ml-4 flex-shrink-0"
                                        title="Delete Feedback"
                                    >
                                        <FaTrashAlt size={16} />
                                    </button>
                                </div>
                            ))}
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default AdminDashboard;