import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Play, Clock, Award, Filter, Search } from 'lucide-react';

const QuizzesPage = () => {
    const { theme } = useTheme();
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    // Placeholder data - ideally from API later
    const allQuizzes = [
        { id: 1, title: 'Indian History Challenge', category: 'History', questions: 15, time: '10 min', plays: '1.2k', difficulty: 'Medium' },
        { id: 2, title: 'Current Affairs 2024', category: 'General Awareness', questions: 20, time: '15 min', plays: '850', difficulty: 'Hard' },
        { id: 3, title: 'Logical Reasoning Alpha', category: 'Reasoning', questions: 10, time: '8 min', plays: '2.1k', difficulty: 'Easy' },
        { id: 4, title: 'Science & Tech Daily', category: 'Science', questions: 15, time: '12 min', plays: '500', difficulty: 'Medium' },
        { id: 5, title: 'English Grammar Basics', category: 'English', questions: 25, time: '20 min', plays: '3.4k', difficulty: 'Easy' },
        { id: 6, title: 'Banking Awareness Mock', category: 'Banking', questions: 30, time: '25 min', plays: '900', difficulty: 'Hard' },
    ];

    const filteredQuizzes = allQuizzes.filter(q =>
        (filter === 'All' || q.category === filter) &&
        q.title.toLowerCase().includes(search.toLowerCase())
    );

    const categories = ['All', 'History', 'General Awareness', 'Reasoning', 'Science', 'English', 'Banking'];

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>All Quizzes</h1>
                    <p className={`${theme.textMuted} max-w-2xl mx-auto`}>Challenge yourself with our extensive collection of quizzes across various topics.</p>
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
                            placeholder="Search quizzes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz) => (
                        <div key={quiz.id} className={`p-6 rounded-2xl border ${theme.sidebar} ${theme.border} ${theme.shadow} hover:scale-[1.02] transition-transform group cursor-pointer`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20`}>
                                    {quiz.category}
                                </span>
                                <span className={`flex items-center text-xs ${theme.textMuted}`}>
                                    <Clock className="w-3 h-3 mr-1" /> {quiz.time}
                                </span>
                            </div>

                            <h3 className={`text-xl font-bold mb-2 ${theme.text} group-hover:text-blue-400 transition-colors`}>{quiz.title}</h3>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-dashed border-gray-700/30">
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <span className="flex items-center"><Play className="w-3 h-3 mr-1" /> {quiz.plays}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase border ${quiz.difficulty === 'Easy' ? 'border-green-500/30 text-green-500' :
                                            quiz.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-500' :
                                                'border-red-500/30 text-red-500'
                                        }`}>{quiz.difficulty}</span>
                                </div>
                                <button className="p-2 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                                    <Play className="w-4 h-4 fill-current" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default QuizzesPage;
