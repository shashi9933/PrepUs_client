import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, Check } from 'lucide-react';
import VideoLoader from './VideoLoader';
import { useTheme } from '../context/ThemeContext';
import { fetchAllExams, fetchCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const ExamSelectionModal = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedExams, setSelectedExams] = useState([]);
    const [step, setStep] = useState('select'); // 'select', 'auth'

    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                setLoading(true);
                try {
                    const [examsData, catsData] = await Promise.all([
                        fetchAllExams(),
                        fetchCategories()
                    ]);
                    setExams(examsData);
                    setCategories([{ id: 'all', name: 'All Exams' }, ...catsData]);
                } catch (error) {
                    console.error("Failed to load data", error);
                }
                setLoading(false);
            };
            loadData();
        }
    }, [isOpen]);

    const filteredExams = selectedCategory === 'all'
        ? exams
        : exams.filter(e => e.category === selectedCategory);

    const toggleSelection = (id) => {
        setSelectedExams(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleStartQuiz = () => {
        if (selectedExams.length === 0) return;

        if (user) {
            // Already logged in, go to quiz
            navigate(`/quiz?exams=${selectedExams.join(',')}`);
        } else {
            // Show auth options
            setStep('auth');
        }
    };

    const handleGoogleSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const userData = {
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            provider: 'google'
        };
        login(userData);
        navigate(`/quiz?exams=${selectedExams.join(',')}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border ${theme.border} ${theme.sidebar} relative flex flex-col`}>

                {/* Header */}
                <div className={`flex justify-between items-center p-6 border-b ${theme.border}`}>
                    <h2 className={`text-2xl font-bold ${theme.text}`}>
                        {step === 'select' ? 'Select Exams' : 'Sign In to Start'}
                    </h2>
                    <button onClick={onClose} className={`${theme.textMuted} hover:${theme.text}`}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 'select' ? (
                        <>
                            <p className={`mb-4 ${theme.textMuted}`}>Choose one or more exams to customize your quiz.</p>

                            {/* Category Filter */}
                            <div className="flex overflow-x-auto space-x-2 pb-2 mb-4 custom-scrollbar">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedCategory === cat.id
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : `bg-white/5 border-transparent hover:bg-white/10 ${theme.textMuted}`
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {loading ? (
                                <VideoLoader />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredExams.map(exam => (
                                        <div
                                            key={exam.id}
                                            onClick={() => toggleSelection(exam.id)}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${selectedExams.includes(exam.id)
                                                ? 'bg-blue-600 border-blue-500 text-white'
                                                : `bg-white/5 border-white/10 ${theme.text} hover:bg-white/10`
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <span className="font-medium block truncate">{exam.title}</span>
                                                <span className="text-xs opacity-70 block truncate">{exam.subtitle}</span>
                                            </div>
                                            {selectedExams.includes(exam.id) && <Check className="w-5 h-5 flex-shrink-0" />}
                                        </div>
                                    ))}
                                    {filteredExams.length === 0 && (
                                        <div className={`col-span-2 text-center py-8 ${theme.textMuted}`}>No exams found in this category.</div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-6 py-8">
                            <p className={`${theme.textMuted} text-center`}>
                                You need to be signed in to track your progress and access the quiz.
                            </p>

                            {/* Google Login Button */}
                            <div className="w-full max-w-xs">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                    theme={theme.isDark ? 'filled_black' : 'outline'}
                                    shape="pill"
                                />
                            </div>

                            <div className="flex items-center w-full max-w-xs">
                                <div className="h-px bg-gray-700 flex-1"></div>
                                <span className="px-4 text-xs text-gray-500">OR</span>
                                <div className="h-px bg-gray-700 flex-1"></div>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className={`w-full max-w-xs py-2 rounded-full border ${theme.border} ${theme.text} hover:bg-white/10 font-medium`}
                            >
                                Continue with Email
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 'select' && (
                    <div className={`p-6 border-t ${theme.border} flex justify-end`}>
                        <button
                            onClick={handleStartQuiz}
                            disabled={selectedExams.length === 0}
                            className={`px-8 py-3 rounded-full font-bold transition-transform ${selectedExams.length > 0
                                ? 'bg-blue-600 text-white hover:scale-105 shadow-lg shadow-blue-600/20'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Continue ({selectedExams.length})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamSelectionModal;
