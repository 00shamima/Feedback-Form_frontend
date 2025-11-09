import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TopicCreator = () => {
    const [topic, setTopic] = useState('');
    const [status, setStatus] = useState(null); 
    const navigate = useNavigate();

    const handleCreateForm = (e) => {
        e.preventDefault();
        
        const trimmedTopic = topic.trim();
        
        if (trimmedTopic === '') {
            setStatus('error');
            return;
        }

        const encodedTopic = encodeURIComponent(trimmedTopic);
        
        navigate(`/survey/${encodedTopic}`);

        setTopic('');
        setStatus('success');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full py-12">
            
            {/* Main Attractive Card Container */}
            <div className="w-full max-w-xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-t-8 border-purple-600 transform hover:shadow-3xl transition duration-500 ease-in-out">
                
                <h2 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
                    🚀 Launch a New Review Form
                </h2>
                <p className="mb-10 text-lg text-gray-600 text-center border-b pb-4">
                    Instantly generate a link for any product, event, or service.
                </p>

                {/* Status Alert */}
                {status === 'error' && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-inner" role="alert">
                        <p className="font-bold">Topic Required</p>
                        <p>Please enter a valid topic name before creating the form.</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleCreateForm}>
                    
                    {/* Input Group */}
                    <div>
                        <label htmlFor="topic-name" className="block text-xl font-semibold text-gray-800 mb-2">
                            What would you like to create a review form for?
                        </label>
                        <input
                            type="text"
                            id="topic-name"
                            required
                            placeholder="e.g.,college ,event course,product ,game'"
                            value={topic}
                            onChange={(e) => {
                                setTopic(e.target.value);
                                setStatus(null); 
                            }}
                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl bg-gray-50 text-base focus:border-purple-500 focus:ring-purple-500 shadow-md transition duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 px-4 rounded-xl text-xl font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:scale-105"
                    >
                        Create Feedback Form
                    </button>
                    
                </form>
            </div>
            
            <div className="w-full max-w-xl text-center mt-8 p-4 text-gray-600">
                <p className="text-sm italic">
                    Once created, the form link will appear in your browser's address bar. Share this link to collect reviews!
                </p>
            </div>
            
        </div>
    );
};

export default TopicCreator;