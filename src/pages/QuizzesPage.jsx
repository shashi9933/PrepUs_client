import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Award, Filter, Search, Loader, Lock, RefreshCcw } from 'lucide-react';
import { generateTest, fetchQuizTemplates } from '../services/api';
import VideoLoader from '../components/VideoLoader';

const QuizzesPage = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [filter, setFilter] = useState('All'); // 'All' or specific category
    const [search, setSearch] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState(null); // ID of template being generated

    // Determine user's preferred exam category for initial filter
    const getUserCategory = () => {
        if (!user || !user.targetExam) return 'All';
        const target = user.targetExam.toLowerCase();
        if (target.includes('bank') || target.includes('sbi') || target.includes('ibps')) return 'Banking';
        if (target.includes('ssc') || target.includes('cgl')) return 'SSC';
        if (target.includes('upsc') || target.includes('ias')) return 'UPSC';
        return 'All';
    };

    const userCategory = getUserCategory();

    useEffect(() => {
        if (userCategory) {
            setFilter(userCategory);
        }
    }, [userCategory]);

    // Load Templates from Backend
    useEffect(() => {
        const loadQuizzes = async () => {
            setLoading(true);
            try {
                // Fetch all templates, filtering is done client side for speed or server side
                // API supports ?category=... but let's fetch all (or by filter)
                // If filter is 'All', fetch all.
                const data = await fetchQuizTemplates(filter);
                setQuizzes(data);
            } catch (error) {
                console.error("Failed to load quizzes", error);
            } finally {
                setLoading(false);
            }
        };
        loadQuizzes();
    }, [filter]); // Reload when category changes

    const filteredQuizzes = quizzes.filter(q =>
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.topic.toLowerCase().includes(search.toLowerCase())
    );

    const categories = ['All', 'Banking', 'SSC', 'UPSC', 'General'];

    const handleStartQuiz = async (template) => {
        if (!user) return navigate('/login');

        setGeneratingId(template._id);

        try {
            // New Architecture: Generate from Template ID
            const res = await generateTest({
                templateId: template._id,
                // Fallbacks just in case, though backend should use template
                examId: user.targetExam || 'general-practice'
            });

            if (res && res.testId) {
                navigate(`/quiz/${res.testId}`);
            } else {
                alert('Failed to generate quiz. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong generating the test.');
        } finally {
            setGeneratingId(null);
        }
    };

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>Practice Quizzes</h1>
                    <p className={`${theme.textMuted} max-w-2xl mx-auto`}>
                        {user ? `Curated for your ${user.targetExam || 'Exam'} preparation.` : 'Login to see personalized quizzes.'}
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

                    {/* Categories */}
                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === cat
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : `bg-white/5 ${theme.text} hover:bg-white/10 border ${theme.border}`
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.textMuted}`} />
                        <input
                            type="text"
                            placeholder="Search topics..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <VideoLoader />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredQuizzes.map((quiz) => (
                            <div key={quiz._id} className={`p-6 rounded-2xl border ${theme.sidebar} ${theme.border} ${theme.shadow} hover:scale-[1.02] transition-transform group`}>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20`}>
                                        {quiz.topic}
                                    </span>
                                    <span className={`flex items-center text-xs ${theme.textMuted}`}>
                                        <Clock className="w-3 h-3 mr-1" /> {quiz.duration} min
                                    </span>
                                </div>

                                <h3 className={`text-xl font-bold mb-2 ${theme.text} group-hover:text-blue-400 transition-colors`}>{quiz.title}</h3>
                                <p className={`text-sm ${theme.textMuted} mb-4`}>{quiz.questionCount} Questions • {quiz.difficulty}</p>

                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-dashed border-gray-700/30">
                                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                                        <div className='flex items-center gap-1'><Award className='w-4 h-4 text-yellow-500' /> <span className='text-xs'>+50 XP</span></div>
                                    </div>
                                    <button
                                        onClick={() => handleStartQuiz(quiz)}
                                        disabled={generatingId !== null}
                                        className={`p-2 rounded-full shadow-lg shadow-blue-600/20 transition-all ${generatingId === quiz._id ? 'bg-gray-600 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        {generatingId === quiz._id ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredQuizzes.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <div className="flex flex-col items-center">
                                    <RefreshCcw className="w-8 h-8 mb-4 opacity-50" />
                                    <p>No quizzes found for this filter.</p>
                                    <button onClick={() => setFilter('All')} className="mt-4 text-blue-500 hover:underline">View All</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizzesPage;
