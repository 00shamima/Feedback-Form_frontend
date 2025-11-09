import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';


const MOCK_CUSTOM_FORMS = {
   
    'custom-my-custom-feedback-form': {
        title: 'Custom Feedback Form: Q&A',
        fields: [
            { id: 1, type: 'text', label: 'Your Name (Required)', required: true },
            { id: 2, type: 'textarea', label: 'Please describe the event details.', required: true },
            { id: 3, type: 'number', label: 'On a scale of 1-10, how likely are you to recommend us?', required: true },
            { id: 4, type: 'text', label: 'Email Address (Optional)', required: false },
        ]
    }
    
};

const CustomFeedbackForm = () => {
    const { uniqueFormId } = useParams();
    
  
    const formConfig = MOCK_CUSTOM_FORMS[uniqueFormId];

    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState(null); 
    const API_URL = 'http://localhost:5000/api/feedback';

    useEffect(() => {
        if (formConfig) {

            const initialData = formConfig.fields.reduce((acc, field) => {
                acc[`field_${field.id}`] = '';
                return acc;
            }, {});
            setFormData(initialData);
        }
    }, [formConfig]);

    if (!formConfig) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
                <p className="text-xl font-bold mb-4">Form Not Found</p>
                <p>The custom form link you followed is invalid or the form has been deleted.</p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
      
        const missingFields = formConfig.fields.filter(field => 
            field.required && !formData[`field_${field.id}`].trim()
        );

        if (missingFields.length > 0) {
            setStatus('error');
            alert('Please fill out all required fields.');
            return;
        }
        
       
        const submissionData = {
            topic: formConfig.title,
            isCustom: true,
            answers: {
               
                ...formData,
                __field_labels: formConfig.fields.map(f => ({ id: `field_${f.id}`, label: f.label }))
            }
        };

        try {
            
            await axios.post(API_URL, submissionData); 
            setStatus('success');
            setTimeout(() => setStatus(null), 5000);
            setFormData({}); 
        } catch (error) {
            console.error('Submission Error:', error.response ? error.response.data : error.message);
            setStatus('error');
            alert('Submission Failed. Check backend connection.');
        }
    };

    return (
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border-t-8 border-purple-500 max-w-2xl mx-auto">
            
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
                <span className="text-purple-600">{formConfig.title}</span>
            </h2>
            <p className="text-center text-gray-500 mb-6 border-b pb-4">Dynamically generated form for custom submissions.</p>

            {status === 'success' && (
                <div className="bg-green-50 border border-green-300 text-green-700 p-3 mb-6 rounded-md text-center" role="alert">
                    <p className="font-bold">🎉 Success! Your submission has been recorded.</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {formConfig.fields.map(field => (
                    <div key={field.id} className="mb-4">
                        <label htmlFor={`field_${field.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {field.type === 'textarea' ? (
                            <textarea
                                id={`field_${field.id}`}
                                name={`field_${field.id}`}
                                rows="4"
                                value={formData[`field_${field.id}`] || ''}
                                onChange={handleChange}
                                required={field.required}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 shadow-sm"
                            ></textarea>
                        ) : (
                            <input
                                type={field.type}
                                id={`field_${field.id}`}
                                name={`field_${field.id}`}
                                value={formData[`field_${field.id}`] || ''}
                                onChange={handleChange}
                                required={field.required}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 shadow-sm"
                            />
                        )}
                    </div>
                ))}
                
                <button type="submit" 
                    className="w-full bg-purple-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-purple-700 transition duration-300 shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed tracking-wider flex items-center justify-center" 
                    disabled={status === 'submitting'}
                >
                    <FaPaperPlane className="mr-2" /> 
                    {status === 'submitting' ? 'Submitting Form...' : 'Submit Custom Form'}
                </button>
            </form>
        </div>
    );
};

export default CustomFeedbackForm;