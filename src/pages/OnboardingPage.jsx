import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfile, fetchAllExams, fetchCurrentUser } from '../services/api';
import VideoLoader from '../components/VideoLoader';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const { theme } = useTheme();
    const [initialLoading, setInitialLoading] = useState(true);

    const [step, setStep] = useState(1);
    const [name, setName] = useState(user?.name || '');
    const [selectedExams, setSelectedExams] = useState(user?.targetExams || []);
    const [availableExams, setAvailableExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingExams, setFetchingExams] = useState(false);
    const [error, setError] = useState('');

    // Check if profile is already complete - fetch from DB on mount
    useEffect(() => {
        const checkProfileCompletion = async () => {
            try {
                if (!user?.id) {
                    navigate('/login');
                    return;
                }

                // Fetch fresh user data from backend
                const currentUser = await fetchCurrentUser();
                console.log('📋 Current user from DB:', currentUser);

                if (currentUser?.isProfileComplete) {
                    console.log('✅ Profile already complete, redirecting to dashboard');
                    navigate('/dashboard', { replace: true });
                    return;
                }

                // Pre-fill if user has partial data
                if (currentUser?.name) setName(currentUser.name);
                if (currentUser?.targetExams?.length > 0) {
                    setSelectedExams(currentUser.targetExams);
                    setStep(2);
                }
            } catch (err) {
                console.error('Error checking profile:', err);
            } finally {
                setInitialLoading(false);
            }
        };

        checkProfileCompletion();
    }, [user, navigate]);

    // Fetch available exams
    useEffect(() => {
        const loadExams = async () => {
            setFetchingExams(true);
            try {
                const exams = await fetchAllExams();
                setAvailableExams(exams || []);
            } catch (err) {
                console.error('Failed to fetch exams:', err);
                setAvailableExams([]);
            }
            setFetchingExams(false);
        };
        loadExams();
    }, []);

    const toggleExam = (examId) => {
        setSelectedExams(prev => {
            if (prev.includes(examId)) {
                return prev.filter(id => id !== examId);
            } else if (prev.length < 3) {
                return [...prev, examId];
            }
            return prev;
        });
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleExamsSubmit = async (e) => {
        e.preventDefault();
        if (selectedExams.length === 0) {
            setError('Please select at least one exam');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const updatedUser = await updateProfile({
                name,
                targetExams: selectedExams
            });

            if (updatedUser) {
                // Update auth context with new user data
                const token = localStorage.getItem('token');
                updatedUser.isProfileComplete = true; // Mark as complete
                await login(updatedUser, token);
                console.log('✅ Profile saved, redirecting to dashboard');
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to update profile');
        }
        setLoading(false);
    };

    if (initialLoading) {
        return <VideoLoader />;
    }

    return (
        <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
            {/* Background Gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
                <div className={`w-full max-w-md ${theme.cardBg} rounded-2xl shadow-2xl p-8 backdrop-blur-md`}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>
                            {step === 1 ? 'Welcome! 👋' : 'Choose Your Path 🎯'}
                        </h1>
                        <p className={`${theme.textMuted} text-sm`}>
                            {step === 1
                                ? 'Tell us your name to get started'
                                : 'Select 1-3 exams to personalize your experience'}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex gap-2 mb-8">
                        <div className={`flex-1 h-1 rounded-full transition-all ${step >= 1 ? 'bg-blue-500' : theme.isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        <div className={`flex-1 h-1 rounded-full transition-all ${step >= 2 ? 'bg-blue-500' : theme.isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Step 1: Name Input */}
                    {step === 1 && (
                        <form onSubmit={handleNameSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name-input" className={`block text-sm font-semibold mb-2 ${theme.text}`}>
                                    Your Name
                                </label>
                                <div className="relative group">
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted} group-focus-within:text-blue-500 transition-colors`} />
                                    <input
                                        id="name-input"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${theme.border} ${theme.text} bg-opacity-50 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all ${theme.isDark ? 'bg-white/5 focus:bg-white/10' : 'bg-gray-50/50 focus:bg-white'}`}
                                        placeholder="Enter your name"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center group"
                            >
                                Next
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    )}

                    {/* Step 2: Exam Selection */}
                    {step === 2 && (
                        <form onSubmit={handleExamsSubmit} className="space-y-6">
                            <div>
                                <label className={`block text-sm font-semibold mb-4 ${theme.text}`}>
                                    Which exams are you targeting?
                                </label>
                                <p className={`text-xs ${theme.textMuted} mb-4`}>
                                    Select 1-3 exams. You can change this later in settings.
                                </p>

                                {fetchingExams ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                    </div>
                                ) : availableExams.length > 0 ? (
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                        {availableExams.map(exam => (
                                            <label
                                                key={exam.id}
                                                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                    selectedExams.includes(exam.id)
                                                        ? 'border-blue-500 bg-blue-500/10'
                                                        : `${theme.border} ${theme.isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`
                                                } ${selectedExams.length >= 3 && !selectedExams.includes(exam.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedExams.includes(exam.id)}
                                                    onChange={() => toggleExam(exam.id)}
                                                    disabled={selectedExams.length >= 3 && !selectedExams.includes(exam.id)}
                                                    className="w-5 h-5 mt-1 rounded-lg border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 cursor-pointer accent-blue-500"
                                                />
                                                <div>
                                                    <p className={`font-semibold ${theme.text}`}>{exam.title}</p>
                                                    {exam.description && (
                                                        <p className={`text-xs ${theme.textMuted} mt-1`}>{exam.description}</p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`p-6 text-center rounded-xl ${theme.isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                                        <p className={theme.textMuted}>No exams available. Please try again later.</p>
                                    </div>
                                )}

                                <div className="mt-4 text-xs font-medium text-blue-600 dark:text-blue-400">
                                    Selected: {selectedExams.length}/3 exams
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className={`flex-1 py-3.5 rounded-xl border-2 ${theme.border} ${theme.text} font-bold hover:bg-opacity-50 transition-all`}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || selectedExams.length === 0}
                                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Setting Up...
                                        </>
                                    ) : (
                                        <>
                                            Get Started
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Footer Note */}
                    <div className={`mt-8 pt-6 border-t ${theme.border}`}>
                        <p className={`text-xs text-center ${theme.textMuted}`}>
                            🎓 Personalized learning: We'll adapt content based on your exam choices
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
