import React from 'react';
import { Link } from 'react-router-dom'; 
import { 
    FaUniversity, 
    FaShoppingBag, 
    FaGamepad, 
    FaChalkboardTeacher, 
    FaBookOpen,          
    FaCalendarAlt,       
    FaHome,              
    FaFilm,              
    FaStore,
    FaUtensils,          
    FaUsers,             
    FaTools,             
    FaTheaterMasks       
} from 'react-icons/fa';

// Define the final list of built-in forms
const BUILT_IN_FORMS = [
    { name: "Course Feedback Form", icon: FaBookOpen, description: "Detailed student reviews on a specific course's content and structure." },
    { name: "College Review and Suggestions", icon: FaUniversity, description: "Gather feedback on overall college facilities, administration, and campus life." },
    { name: "Lecturer/Teacher Feedback", icon: FaChalkboardTeacher, description: "Evaluate the teaching style, clarity, and effectiveness of an instructor." },
    { name: "Semester Feedback Form", icon: FaCalendarAlt, description: "Assess the entire semester experience, including workload, resources, and overall satisfaction." },
    { name: "Classroom Experience Feedback", icon: FaHome, description: "Review the physical environment, technology, and comfort of the learning space." },
    { name: "College Culturals Feedback Form", icon: FaTheaterMasks, description: "Review cultural events, performances, organization, and participation experience." },
    { name: "Product Review", icon: FaShoppingBag, description: "Collect immediate impressions, feature ratings, and market reception for a new product." },
    { name: "Game Feedback", icon: FaGamepad, description: "Specific form for gathering bug reports, gameplay reviews, and feature requests from users." },
    { name: "Food Review Form", icon: FaUtensils, description: "Rate menu items, service quality, and ambiance for any dining experience." },
    { name: "Conference Feedback Form", icon: FaUsers, description: "Evaluate sessions, speakers, networking opportunities, and overall event logistics." },
    { name: "Workshop Feedback Form", icon: FaTools, description: "Assess practical learning events, covering material relevance, instructor engagement, and exercises." },
    { name: "Your Shopping Experience", icon: FaStore, description: "Survey customer satisfaction regarding a recent store visit or online purchase." },
    { name: "Movie Feedback Form", icon: FaFilm, description: "Collect ratings and comments on a film's plot, acting, visual effects, and sound." },
];

const FormLibrary = () => {
    
    return (
        <div className="flex flex-col items-center justify-center min-h-full py-6">
            
            <div className="w-full max-w-4xl bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl border-t-8 border-indigo-500">
                
                <h2 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
                    📚 Form Library
                </h2>
                <p className="mb-10 text-lg text-gray-600 text-center border-b pb-4">
                    Select any built-in template to view the live form and get the shareable link.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {BUILT_IN_FORMS.map((form) => {
                        const encodedTopic = encodeURIComponent(form.name);
                        const destination = `/survey/${encodedTopic}`;

                        return (
                            <Link 
                                key={form.name}
                                to={destination}
                                className="block cursor-pointer" 
                            >
                                <div 
                                    className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col justify-between h-full hover:shadow-xl hover:bg-indigo-100 transition duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="flex items-start mb-4">
                                        <form.icon className="text-indigo-600 text-3xl mr-4 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{form.name}</h3>
                                            <p className="text-sm text-gray-600">{form.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center py-2 px-4 rounded-lg text-sm font-semibold bg-indigo-600 text-white mt-4 hover:bg-indigo-700 transition duration-200">
                                        View Form
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FormLibrary;