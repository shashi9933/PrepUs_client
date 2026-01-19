import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile, fetchAllExams } from '../services/api'; // Added fetchAllExams
import { User, Target, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const OnboardingPage = () => {
    const { user, login } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [exam, setExam] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [availableExams, setAvailableExams] = useState([]);
    const [fetchingExams, setFetchingExams] = useState(true);

    // 1. Pre-fill Name & Load Dynamic Exams
    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }

        const loadExams = async () => {
            try {
                const examsData = await fetchAllExams();
                setAvailableExams(examsData || []);
            } catch (err) {
                console.error("Failed to load exams", err);
                // Fallback hardcoded if API fails totally
                setAvailableExams([
                    { id: 'sbi-po', title: 'SBI PO' },
                    { id: 'upsc-cse', title: 'UPSC CSE' }
                ]);
            } finally {
                setFetchingExams(false);
            }
        };
        loadExams();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 2. Defensive Check
        if (!user?.id) {
            setError('Authentication session lost. Please login again.');
            setTimeout(() => navigate('/'), 2000);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 3. API Call
            const res = await updateProfile({
                userId: user.id,
                name,
                targetExam: exam
                // backend should ideally handle 'onboardingCompleted' flag logic or pass it here
            });

            if (res.user) {
                // 4. Correct Login Call (Preserve Token)
                const token = localStorage.getItem('token');
                await login(res.user, token);
                navigate('/');
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save your profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen pt-20 flex justify-center items-center ${theme.bg} px-4`}>
            <div className={`w-full max-w-md p-8 rounded-2xl ${theme.card} ${theme.border} border shadow-xl`}>
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>One Last Step!</h2>
                    <p className={theme.textMuted}>Tell us a bit about yourself to personalize your experience.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset disabled={loading} className="space-y-6 group-disabled:opacity-70">
                        <div>
                            <label htmlFor="name-input" className={`block text-sm font-medium mb-1.5 ${theme.text}`}>What should we call you?</label>
                            <div className="relative">
                                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                                <input
                                    id="name-input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                                    placeholder="Your Name"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="exam-select" className={`block text-sm font-medium mb-1.5 ${theme.text}`}>
                                Which Exam are you targeting?
                            </label>
                            <div className="relative">
                                <Target className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                                <select
                                    id="exam-select"
                                    value={exam}
                                    onChange={(e) => setExam(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.isDark ? 'bg-white/5' : 'bg-gray-50'} appearance-none`}
                                    required
                                >
                                    <option value="" disabled>Select an Exam</option>
                                    {fetchingExams ? (
                                        <option disabled>Loading exams...</option>
                                    ) : (
                                        availableExams.map(ex => (
                                            <option key={ex.id} value={ex.id}>
                                                {ex.title}
                                            </option>
                                        ))
                                    )}
                                    {!fetchingExams && availableExams.length === 0 && (
                                        <option value="general">General Competition</option>
                                    )}
                                </select>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-1">
                                💡 This helps us generate better daily tests for you.
                            </p>
                        </div>
                    </fieldset>

                    <button
                        type="submit"
                        disabled={loading || fetchingExams}
                        className="w-full py-3.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Setting up...
                            </>
                        ) : (
                            <>
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;
