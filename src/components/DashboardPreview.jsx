import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Clock, Users, ChevronRight, Target, TrendingUp, BookOpen, Zap } from 'lucide-react';

const DashboardPreview = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Analytics data
    const analytics = {
        totalQuizzesAttempted: 24,
        totalQuestionsAnswered: 340,
        averageAccuracy: 75,
        weeklyImprovement: 12,
        strengths: ['Reasoning', 'Quantitative'],
        improvements: ['English', 'GK']
    };

    return (
        <div className="py-12 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Trusted By Header */}
                <div className="flex justify-between items-end mb-6">
                    <h2 className={`text-2xl font-semibold ${theme.text}`}>
                        Trusted by <span className={theme.name === 'Neon' ? 'text-cyan-400' : theme.accent.replace('bg-', 'text-')}>100,000+</span> Aspirants
                    </h2>
                    <div className="flex space-x-4 text-sm font-medium">
                        <div className="flex items-center space-x-1 text-orange-500">
                            <Flame className="w-4 h-4 fill-orange-500" />
                            <span>7-Day Streak</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-400">
                            <Clock className="w-4 h-4" />
                            <span>3-Day Streak</span>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Card */}
                <div className={`rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl border ${theme.sidebar} ${theme.border} ${theme.shadow}`}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <div>
                                <h3 className={`text-2xl font-bold mb-1 ${theme.text}`}>Today's Challenge</h3>
                                <p className={`text-sm tracking-wide uppercase font-semibold opacity-70 ${theme.text}`}>Daily Current Affairs Quiz</p>
                            </div>

                            <div className={`flex items-center space-x-4 text-sm ${theme.textMuted}`}>
                                <span>Exam: UPSC, IBPS</span>
                                <span>Date: April 24, 2024</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 ${theme.border} bg-gray-600 flex items-center justify-center text-xs text-white`}>
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <span className={`text-sm ${theme.textMuted}`}>2K+ Participants</span>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button 
                                    onClick={() => navigate('/daily-test')}
                                    className={`px-8 py-3 rounded-full font-bold text-white shadow-lg ${theme.name === 'Neon' ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-orange-500'} hover:opacity-90 transition-opacity flex items-center gap-2`}
                                >
                                    <Zap className="w-4 h-4" />
                                    START QUIZ
                                </button>
                                <button 
                                    onClick={() => navigate('/quizzes')}
                                    className={`px-8 py-3 rounded-full font-bold border ${theme.border} ${theme.text} hover:bg-white/5 transition-colors flex items-center gap-2`}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    QUIZZES
                                </button>
                            </div>
                        </div>

                        {/* Right Analytics Section */}
                        <div className={`rounded-2xl p-6 relative overflow-hidden ${theme.card} ${theme.shadow}`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 opacity-20"></div>

                            <div className="relative z-10">
                                <h4 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme.text}`}>
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    Your Performance
                                </h4>

                                {/* Performance Metrics */}
                                <div className="space-y-4">
                                    {/* Accuracy Circle */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-16 h-16 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-700 opacity-20" />
                                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="176" strokeDashoffset="44" className={theme.name === 'Neon' ? 'text-cyan-400' : 'text-green-500'} />
                                                </svg>
                                                <div className="absolute text-center">
                                                    <span className={`block text-sm font-bold ${theme.text}`}>{analytics.averageAccuracy}%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${theme.textMuted}`}>Accuracy</p>
                                                <p className={`text-sm font-bold ${theme.text}`}>Excellent</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/analytics')}
                                            className={`p-2 rounded-lg hover:bg-white/10 transition-colors`}
                                        >
                                            <ChevronRight className="w-5 h-5 text-blue-400" />
                                        </button>
                                    </div>

                                    {/* Key Stats */}
                                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                                        <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => navigate('/analytics')}>
                                            <p className={`text-xs ${theme.textMuted}`}>Quizzes</p>
                                            <p className={`text-lg font-bold ${theme.text}`}>{analytics.totalQuizzesAttempted}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => navigate('/analytics')}>
                                            <p className={`text-xs ${theme.textMuted}`}>Improvement</p>
                                            <p className={`text-lg font-bold text-green-400`}>+{analytics.weeklyImprovement}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links & Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* Strong Areas */}
                    <div 
                        onClick={() => navigate('/analytics')}
                        className={`p-6 rounded-2xl border ${theme.border} ${theme.sidebar} cursor-pointer hover:border-green-500/50 transition-all group`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-lg font-bold ${theme.text}`}>Strengths</h4>
                            <ChevronRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="space-y-2">
                            {analytics.strengths.map((strength, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-400" />
                                    <span className={theme.text}>{strength}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Areas to Improve */}
                    <div 
                        onClick={() => navigate('/analytics')}
                        className={`p-6 rounded-2xl border ${theme.border} ${theme.sidebar} cursor-pointer hover:border-orange-500/50 transition-all group`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-lg font-bold ${theme.text}`}>Improve</h4>
                            <ChevronRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="space-y-2">
                            {analytics.improvements.map((improvement, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-orange-400" />
                                    <span className={theme.text}>{improvement}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mock Tests */}
                    <div 
                        onClick={() => navigate('/mock-tests')}
                        className={`p-6 rounded-2xl border ${theme.border} ${theme.sidebar} cursor-pointer hover:border-blue-500/50 transition-all group`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-lg font-bold ${theme.text}`}>Mock Tests</h4>
                            <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-400" />
                                <span className={theme.text}>Full Length</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span className={theme.text}>Scheduled Daily</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPreview;
