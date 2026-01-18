import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Award, Filter, Search, Loader, Lock } from 'lucide-react';
import { generateTest } from '../services/api';

// Static config for available quiz topics per category
// In a real app, this might come from an API /api/categories/topics
const EXAM_TOPICS = {
    'Banking': [
        { title: 'Quantitative Aptitude', topic: 'Quantitative Aptitude', questions: 15, time: '15 min', difficulty: 'Hard' },
        { title: 'Reasoning Ability', topic: 'Reasoning', questions: 15, time: '12 min', difficulty: 'Medium' },
        { title: 'English Language', topic: 'English', questions: 20, time: '15 min', difficulty: 'Medium' },
        { title: 'Banking Awareness', topic: 'Banking', questions: 25, time: '10 min', difficulty: 'Hard' },
        { title: 'Current Affairs', topic: 'General Awareness', questions: 20, time: '10 min', difficulty: 'Medium' }
    ],
    'SSC': [
        { title: 'General Intelligence', topic: 'Reasoning', questions: 15, time: '12 min', difficulty: 'Medium' },
        { title: 'General Awareness', topic: 'General Awareness', questions: 20, time: '10 min', difficulty: 'Medium' },
        { title: 'Quantitative Aptitude', topic: 'Quantitative Aptitude', questions: 15, time: '15 min', difficulty: 'Hard' },
        { title: 'English Comprehension', topic: 'English', questions: 20, time: '15 min', difficulty: 'Easy' }
    ],
    'UPSC': [
        { title: 'History & Culture', topic: 'History', questions: 10, time: '10 min', difficulty: 'Hard' },
        { title: 'Geography', topic: 'Geography', questions: 10, time: '10 min', difficulty: 'Medium' },
        { title: 'Polity & Governance', topic: 'Polity', questions: 10, time: '10 min', difficulty: 'Hard' },
        { title: 'Economy', topic: 'Economy', questions: 10, time: '10 min', difficulty: 'Hard' }
    ],
    // Default fallback
    'General': [
        { title: 'General Knowledge', topic: 'GK', questions: 10, time: '5 min', difficulty: 'Easy' },
        { title: 'Mental Ability', topic: 'Reasoning', questions: 10, time: '8 min', difficulty: 'Medium' },
        { title: 'Science Choice', topic: 'Science', questions: 10, time: '5 min', difficulty: 'Easy' }
    ]
};

const QuizzesPage = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [filter, setFilter] = useState('All'); // 'All' or specific category
    const [search, setSearch] = useState('');
    const [generatingId, setGeneratingId] = useState(null); // ID of topic being generated

    // Determine user's preferred exam category
    // Logic: If user has a target exam (e.g. 'sbi-po'), map it to 'Banking'.
    // Simple heuristic for now:
    const getUserCategory = () => {
        if (!user || !user.targetExam) return 'General';
        const target = user.targetExam.toLowerCase();
        if (target.includes('bank') || target.includes('sbi') || target.includes('ibps')) return 'Banking';
        if (target.includes('ssc') || target.includes('cgl')) return 'SSC';
        if (target.includes('upsc') || target.includes('ias')) return 'UPSC';
        return 'General';
    };

    const userCategory = getUserCategory();

    // Default to user's category on load
    useEffect(() => {
        if (userCategory) {
            setFilter(userCategory);
        }
    }, [userCategory]);

    // Flatten all topics for searching/displaying 'All'
    // But prioritize user's preference if filter is set
    const getDisplayQuizzes = () => {
        let quizzes = [];

        if (filter === 'All') {
            // Combine all unique from map
            // For now just show "General" + "User Category" mixed
            quizzes = [...(EXAM_TOPICS[userCategory] || []), ...(EXAM_TOPICS['General'] || [])];
        } else {
            quizzes = EXAM_TOPICS[filter] || EXAM_TOPICS['General'];
        }

        return quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));
    };

    const displayQuizzes = getDisplayQuizzes();
    const categories = ['All', 'Banking', 'SSC', 'UPSC', 'General'];

    const handleStartQuiz = async (quizData) => {
        if (!user) return navigate('/login');

        setGeneratingId(quizData.title);

        try {
            const res = await generateTest({
                examId: user.targetExam || 'general-practice', // Fallback ID
                topic: quizData.topic,
                count: quizData.questions
            });

            if (res && res.testId) {
                navigate(`/quiz?testId=${res.testId}`);
            } else {
                alert('Failed to generate quiz. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong.');
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

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayQuizzes.map((quiz, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl border ${theme.sidebar} ${theme.border} ${theme.shadow} hover:scale-[1.02] transition-transform group`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20`}>
                                    {quiz.topic}
                                </span>
                                <span className={`flex items-center text-xs ${theme.textMuted}`}>
                                    <Clock className="w-3 h-3 mr-1" /> {quiz.time}
                                </span>
                            </div>

                            <h3 className={`text-xl font-bold mb-2 ${theme.text} group-hover:text-blue-400 transition-colors`}>{quiz.title}</h3>
                            <p className={`text-sm ${theme.textMuted} mb-4`}>{quiz.questions} Questions • {quiz.difficulty}</p>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-dashed border-gray-700/30">
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    {/* Placeholder stats */}
                                    <div className='flex items-center gap-1'><Award className='w-4 h-4 text-yellow-500' /> <span className='text-xs'>+50 XP</span></div>
                                </div>
                                <button
                                    onClick={() => handleStartQuiz(quiz)}
                                    disabled={generatingId !== null}
                                    className={`p-2 rounded-full shadow-lg shadow-blue-600/20 transition-all ${generatingId === quiz.title ? 'bg-gray-600 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    {generatingId === quiz.title ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                </button>
                            </div>
                        </div>
                    ))}

                    {displayQuizzes.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No quizzes found for this filter.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default QuizzesPage;
