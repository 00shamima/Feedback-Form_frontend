import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaClipboardCheck, FaChartBar } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';


const BASE_API_URL = import.meta.env.VITE_BACKEND_API_URL || '';
const FEEDBACK_ENDPOINT = '/api/feedback';
const cleanBaseURL = BASE_API_URL.replace(/\/$/, '');
const API_URL = `${cleanBaseURL}${FEEDBACK_ENDPOINT}`;

console.log('Backend API URL:', API_URL); // Debugging line

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
      const response = await axios.get(API_URL);
      const processedFeedbacks = response.data.map(f => ({
        ...f,
        // normalize id so components can rely on `id`
        id: f.id ?? f._id ?? f.key,
        key: f.id ?? f._id ?? f.key,
        // Assuming your answers field might be a JSON string from the database
        answers: (typeof f.answers === 'string') ? JSON.parse(f.answers) : f.answers
      }));
      setFeedbacks(processedFeedbacks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Ensure your backend is running and the API key is correct.');
      // The console log will now show the correctly formed URL being attempted
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
      await axios.delete(`${API_URL}/${id}`);
      fetchFeedbacks();
    } catch (err) {
      console.error("Deletion Error:", err);
      alert("Failed to delete feedback. Check server console.");
    }
  };

  // --- Statistics Calculation (Unchanged) ---
  const statistics = useMemo(() => {
    if (feedbacks.length === 0) return { avgRating: 0, total: 0, recommendRate: 0, topics: {} };

    const totalRating = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0);
    const recommended = feedbacks.filter(f => (f.recommend || 'Yes').toLowerCase() === 'yes').length;
    const topicCounts = feedbacks.reduce((acc, f) => {
      acc[f.topic] = (acc[f.topic] || 0) + 1;
      return acc;
    }, {});

    return {
      avgRating: (totalRating / feedbacks.length).toFixed(2),
      total: feedbacks.length,
      recommendRate: ((recommended / feedbacks.length) * 100).toFixed(0),
      topics: topicCounts,
    };
  }, [feedbacks]);

  // --- Components for Rendering (AdminDashboard continues here) ---

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-4 bg-white rounded-xl shadow-lg border-l-4 ${color} flex items-center`}>
      <Icon className={`text-4xl mr-4 ${color.replace('border-', 'text-')}`} />
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  const TopicDistribution = ({ topics }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg col-span-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaChartBar className="mr-2 text-indigo-500" /> Feedback Distribution by Topic
      </h3>
      <div className="space-y-3">
        {Object.entries(topics).sort(([, a], [, b]) => b - a).map(([topic, count]) => (
          <div key={topic}>
            <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
              <span>{topic}</span>
              <span>{count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${(count / statistics.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  if (loading) return <p className="text-xl text-center py-10 text-gray-600">Loading feedback data...</p>;
  
  if (error) return (
    <div className="max-w-4xl mx-auto mt-10 p-5">
      <p className="text-xl text-center py-10 text-red-600 border border-red-300 p-4 rounded-lg bg-red-50">
        ❌ Error: {error}
      </p>
      <p className='text-center text-sm text-gray-500 mt-2'>Please ensure your backend server is running at the configured URL: **{API_URL}**</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center mb-2">
          <FaClipboardCheck className="text-indigo-600 mr-3" /> Feedback Survey App - Admin Dashboard
        </h1>
        <p className="text-gray-500">Overview of all submitted feedback.</p>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Reviews"
            value={statistics.total}
            icon={FaClipboardCheck}
            color="border-indigo-500"
          />
          <StatCard
            title="Avg. Rating (5-star)"
            value={statistics.avgRating}
            icon={FaStar}
            color="border-yellow-500"
          />
          <StatCard
            title="Recommendation Rate"
            value={`${statistics.recommendRate}%`}
            icon={FaChartBar}
            color="border-green-500"
          />
          <TopicDistribution topics={statistics.topics} />
        </div>

        {/* Feedback Table */}
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200">
          <h2 className="text-2xl font-bold p-6 bg-gray-100 border-b text-gray-800">
            Recent Submissions ({feedbacks.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic / Identifier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewer
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbacks.map((f) => (
                  <tr key={f.id || f._id} className="hover:bg-indigo-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-indigo-600">{f.topic}</div>
                      <div className="text-xs text-gray-500">{f.courseName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-400">
                          {'★'.repeat(f.rating)}
                        </span>
                        <span className="text-gray-300">
                          {'★'.repeat(5 - f.rating)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs text-sm text-gray-700 truncate" title={f.comments}>
                      {f.comments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-gray-500">{f.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(f.id || f._id, f.topic, f.name)}
                        className="text-red-600 hover:text-red-900 transition duration-150 p-2 rounded-full hover:bg-red-100"
                        title="Delete Feedback"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {feedbacks.length === 0 && (
            <p className="text-center py-10 text-gray-500">No feedback submissions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;