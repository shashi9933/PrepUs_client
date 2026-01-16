import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Flame, Clock, Users, ChevronRight, Target, Calendar } from 'lucide-react';

const DashboardPreview = () => {
    const { theme } = useTheme();

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
                                <button className={`px-8 py-3 rounded-full font-bold text-white shadow-lg ${theme.name === 'Neon' ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-orange-500'} hover:opacity-90 transition-opacity`}>
                                    START QUIZ
                                </button>
                                <button className={`px-8 py-3 rounded-full font-bold border ${theme.border} ${theme.text} hover:bg-white/5 transition-colors`}>
                                    REVISION
                                </button>
                            </div>
                        </div>

                        {/* Right Analytics Mock */}
                        <div className={`rounded-2xl p-6 relative overflow-hidden ${theme.card} ${theme.shadow}`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 opacity-20"></div>

                            <div className="flex items-center justify-between mb-8">
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700 opacity-20" />
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="62.8" className={theme.name === 'Neon' ? 'text-cyan-400' : 'text-blue-500'} />
                                    </svg>
                                    <div className="absolute text-center">
                                        <span className={`block text-xl font-bold ${theme.text}`}>75%</span>
                                        <span className={`text-[10px] ${theme.textMuted}`}>Accuracy</span>
                                    </div>
                                </div>

                                {/* Graph Lines */}
                                <div className="flex-1 h-32 ml-6 flex items-end space-x-2 relative">
                                    {/* Use SVG for a smooth curve line */}
                                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                                        <path d="M0,80 C20,80 40,70 60,70 C80,70 100,20 120,40 C140,60 160,30 180,20"
                                            fill="none"
                                            stroke={theme.name === 'Neon' ? '#22d3ee' : '#3b82f6'}
                                            strokeWidth="3"
                                            className="drop-shadow-lg"
                                        />
                                        <circle cx="60" cy="70" r="4" fill={theme.bg.includes('text') ? 'white' : 'currentColor'} className="text-white" />
                                        <circle cx="120" cy="40" r="4" fill={theme.bg.includes('text') ? 'white' : 'currentColor'} className="text-white" />
                                        <circle cx="180" cy="20" r="4" fill={theme.bg.includes('text') ? 'white' : 'currentColor'} className="text-white" />
                                    </svg>

                                    <div className="w-full flex justify-between text-[10px] absolute -bottom-6 text-gray-400">
                                        <span>Apr 21</span>
                                        <span>Apr 23</span>
                                        <span>Apr 25</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPreview;
