import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Play, Award, Loader, RefreshCcw } from 'lucide-react';
import { fetchDailyTest, fetchAllExams } from '../services/api';
import VideoLoader from '../components/VideoLoader';

const QuizzesPage = () => {
    const { theme } = useTheme();
    const { user, loading: loadingAuth } = useAuth();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingExamId, setLoadingExamId] = useState(null);
    const [error, setError] = useState(null);

    // Load exams from backend
    useEffect(() => {
        if (loadingAuth) return;
        if (!user) {
            navigate('/login');
            return;
        }

        const loadExams = async () => {
            try {
                setLoading(true);
                console.log('📚 Loading exams...');
                const data = await fetchAllExams();
                console.log('✅ Exams loaded:', data?.length);
                setExams(data || []);
            } catch (err) {
                console.error('❌ Failed to load exams:', err);
                setError('Failed to load exams');
            } finally {
                setLoading(false);
            }
        };

        loadExams();
    }, [user, loadingAuth, navigate]);

    const handleStartQuiz = async (exam) => {
        if (!user) return navigate('/login');
        if (!exam.id) {
            alert('Invalid exam');
            return;
        }

        setLoadingExamId(exam.id);

        try {
            console.log('🎯 Fetching daily test for exam:', exam.id);
            
            // Fetch the daily test directly (no generation)
            const test = await fetchDailyTest(exam.id);
            console.log('✅ Daily test fetched:', { testId: test._id, questionsCount: test.questions?.length });

            if (test && test._id) {
                console.log('🚀 Navigating to quiz:', `/quiz/${test._id}`);
                navigate(`/quiz/${test._id}`);
            } else {
                alert('No test available for this exam today. Please try another exam.');
            }
        } catch (err) {
            console.error('❌ Error fetching daily test:', err);
            alert(`Error: ${err.response?.data?.error || err.message || 'Failed to load test'}`);
        } finally {
            setLoadingExamId(null);
        }
    };

    if (loadingAuth) return <VideoLoader />;

    if (!user) {
        return (
            <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>Please Login</h1>
                    <p className={theme.textMuted}>You need to be logged in to access quizzes.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>Daily Drills</h1>
                    <p className={`${theme.textMuted} max-w-2xl mx-auto`}>
                        Practice with daily curated tests for your exam preparation.
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {loading ? (
                    <VideoLoader />
                ) : exams.length === 0 ? (
                    <div className="text-center py-12">
                        <RefreshCcw className="w-8 h-8 mx-auto mb-4 opacity-50" />
                        <p className={theme.textMuted}>No exams available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <div 
                                key={exam.id} 
                                className={`p-6 rounded-2xl border ${theme.sidebar} ${theme.border} ${theme.shadow} hover:scale-[1.02] transition-transform group`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20`}>
                                        {exam.category || 'General'}
                                    </span>
                                    <span className={`text-xs ${theme.textMuted}`}>
                                        Daily
                                    </span>
                                </div>

                                <h3 className={`text-xl font-bold mb-2 ${theme.text} group-hover:text-blue-400 transition-colors`}>
                                    {exam.title}
                                </h3>
                                <p className={`text-sm ${theme.textMuted} mb-4`}>
                                    {exam.subtitle}
                                </p>

                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-dashed border-gray-700/30">
                                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                                        <div className='flex items-center gap-1'>
                                            <Award className='w-4 h-4 text-yellow-500' />
                                            <span className='text-xs'>+50 XP</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleStartQuiz(exam)}
                                        disabled={loadingExamId !== null}
                                        className={`p-2 rounded-full shadow-lg shadow-blue-600/20 transition-all ${loadingExamId === exam.id ? 'bg-gray-600 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        {loadingExamId === exam.id ? (
                                            <Loader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Play className="w-4 h-4 fill-current" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizzesPage;
