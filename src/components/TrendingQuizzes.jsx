import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, Landmark, BarChart, Globe, ArrowRight } from 'lucide-react';

const TrendingQuizzes = () => {
    const { theme } = useTheme();

    const trendingQuizzes = [
        { title: 'Current Affairs January 2026', attempts: '12.5K', difficulty: 'Medium', icon: TrendingUp, color: 'text-blue-400' },
        { title: 'Indian Polity Fundamentals', attempts: '8.3K', difficulty: 'Easy', icon: Landmark, color: 'text-orange-400' },
        { title: 'Economic Survey 2025', attempts: '5.7K', difficulty: 'Hard', icon: BarChart, color: 'text-green-400' },
        { title: 'World Geography Masterclass', attempts: '9.1K', difficulty: 'Medium', icon: Globe, color: 'text-purple-400' }
    ];

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Trending Quizzes</h2>
                    <button className={`${theme.textMuted} hover:${theme.text} text-sm flex items-center`}>
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trendingQuizzes.map((quiz, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl border ${theme.sidebar} ${theme.border} ${theme.shadow} hover:border-opacity-50 transition-all group`}>
                            <div className="flex justify-between items-start">
                                <div className="flex space-x-4">
                                    <div className={`p-3 rounded-xl bg-white/5 border ${theme.border} ${quiz.color}`}>
                                        <quiz.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg mb-1 ${theme.text} group-hover:text-opacity-90`}>{quiz.title}</h3>
                                        <div className={`flex items-center space-x-3 text-sm ${theme.textMuted}`}>
                                            <span>{quiz.attempts} Attempts</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                                            <span className={`${quiz.difficulty === 'Easy' ? theme.green :
                                                quiz.difficulty === 'Hard' ? theme.red : 'text-yellow-400'
                                                }`}>{quiz.difficulty}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className={`p-2 rounded-full border ${theme.border} hover:bg-white/5 ${theme.textMuted} hover:${theme.text}`}>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendingQuizzes;
