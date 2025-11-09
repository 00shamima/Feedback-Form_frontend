import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaBook, FaPaperPlane, FaTimesCircle } from 'react-icons/fa'; 


// Use environment variable for the base URL
const BASE_API_URL = import.meta.env.VITE_BACKEND_API_URL;
const FEEDBACK_ENDPOINT = '/api/feedback'; 
const API_URL = `${BASE_API_URL}${FEEDBACK_ENDPOINT}`;

const initialFormState = {
    name: '',
    email: '',
    courseName: '', 
    rating: 0, 
    comments: '',
    recommend: 'Yes',
};

// ... StarRatingInput and InputGroup components remain the same ...

const StarRatingInput = ({ rating, setRating }) => {
    return (
        <div className="flex justify-center space-x-1 text-4xl mb-6">
            {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                    <label key={index}>
                        <input type="radio" name="rating" value={currentRating} onClick={() => setRating(currentRating)} className="hidden"/>
                        <FaStar
                            className="cursor-pointer transition-colors duration-200"
                            color={currentRating <= rating ? "#facc15" : "#e5e7eb"} 
                            size={40}
                            title={`Rate ${currentRating} stars`}
                        />
                    </label>
                );
            })}
        </div>
    );
};

const InputGroup = ({ label, id, isRequired = false, children }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
    </div>
);


const FeedbackForm = () => {
    const { topic: urlTopic } = useParams(); 
    const topic = decodeURIComponent(urlTopic || 'General Service'); 
    
    const [formData, setFormData] = useState(initialFormState);
    const [status, setStatus] = useState(null); 
    
    // getCourseNameLabel and handleChange/handleStarChange functions remain the same
    
    const getCourseNameLabel = () => {
        if (topic.includes('Course') || topic.includes('Semester') || topic.includes('Classroom') || topic.includes('Lecturer')) {
            return "Course/Module Identifier (e.g., CS 101, Fall 2025)";
        }
        if (topic.includes('Product') || topic.includes('Game') || topic.includes('Movie')) {
            return "Specific Product/Item Name";
        }
        if (topic.includes('Food') || topic.includes('Shopping')) {
            return "Item / Store Name";
        }
        if (topic.includes('Conference') || topic.includes('Workshop') || topic.includes('Culturals')) {
            return "Event Name / Session Title";
        }
        return "Specific Identifier (Required)";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleStarChange = (newRating) => {
        setFormData((prevData) => ({
            ...prevData,
            rating: newRating,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        // --- Required Field Validation ---
        if (!formData.name.trim() || !formData.email.trim() || !formData.comments.trim() || !formData.courseName.trim()) {
            setStatus('error');
            alert('Name, Email, Specific Identifier, and Comments are required fields.');
            return;
        }
        
        if (formData.rating === 0) {
            setStatus('error');
            alert('Please select a Star Rating before submitting.');
            return;
        }
        
        const submissionData = {
            topic: topic,
            ...formData
        };

        try {
            // FIX: Using the combined API_URL for POST
            await axios.post(API_URL, submissionData); 
            setStatus('success');
            setTimeout(() => setStatus(null), 5000);
            setFormData(initialFormState); 
        } catch (error) {
            console.error('Submission Error:', error.response ? error.response.data : error.message);
            setStatus('error');
            alert('Submission Failed. Check backend connection.');
        }
    };

    return (
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border-t-8 border-indigo-500 max-w-2xl mx-auto">
            
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
                Review for <span className="text-indigo-600">{topic}</span>
            </h2>
            
            {status === 'success' && (
                <div className="bg-green-50 border border-green-300 text-green-700 p-3 mb-6 rounded-md text-center" role="alert">
                    <p className="font-bold">🎉 Success! Thank you for your review.</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Personal Info Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Your Full Name" id="name" isRequired={true}>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Doe"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                        />
                    </InputGroup>

                    <InputGroup label="Email Address" id="email" isRequired={true}>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@example.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                        />
                    </InputGroup>
                </div>
                
                {/* 2. SPECIFIC IDENTIFIER FIELD */}
                <InputGroup 
                    label={getCourseNameLabel()} 
                    id="courseName" 
                    isRequired={true}
                >
                    <div className="relative">
                        <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" id="courseName" name="courseName" value={formData.courseName} onChange={handleChange} required 
                            placeholder="Enter specific identifier (required)"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                        />
                    </div>
                </InputGroup>

                {/* 3. Comments (Required) */}
                <InputGroup label="Detailed Comments" id="comments" isRequired={true}>
                    <textarea id="comments" name="comments" rows="4" value={formData.comments} onChange={handleChange} required 
                        placeholder={`Share your detailed thoughts about ${topic} (required)...`}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                    ></textarea>
                </InputGroup>

                {/* 4. Rating Section (Required) */}
                <div className="bg-indigo-50 p-6 rounded-xl shadow-inner border border-indigo-200 mt-6">
                    <h3 className="text-xl font-semibold text-center text-indigo-700 mb-4">
                        Rate Your Overall Experience <span className="text-red-500">*</span>
                    </h3>
                    <StarRatingInput rating={formData.rating} setRating={handleStarChange} />
                </div>
                
                <button type="submit" 
                    className="w-full bg-indigo-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed tracking-wider" 
                    disabled={status === 'submitting'}
                >
                    {status === 'submitting' ? 'Sending Review...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;