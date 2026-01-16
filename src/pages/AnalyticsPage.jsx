import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { BarChart, Activity, Target, Brain, ArrowUp } from 'lucide-react';

const AnalyticsPage = () => {
    const { theme } = useTheme();

    // Mock Data
    const strengths = ['History', 'Current Affairs'];
    const weaknesses = ['Quantitative Aptitude', 'Geometry'];

    const performanceData = [
        { subject: 'History', score: 85, color: 'bg-green-500' },
        { subject: 'Polity', score: 70, color: 'bg-blue-500' },
        { subject: 'Geography', score: 65, color: 'bg-yellow-500' },
        { subject: 'Economy', score: 45, color: 'bg-orange-500' },
        { subject: 'Maths', score: 30, color: 'bg-red-500' },
    ];

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <h1 className={`text-3xl font-bold mb-8 ${theme.text}`}>Your Performance Analytics</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Quizzes', value: '42', icon: Activity, color: 'text-blue-500' },
                        { label: 'Avg. Score', value: '68%', icon: Target, color: 'text-green-500' },
                        { label: 'Time Spent', value: '12h', icon: ClockIcon, color: 'text-purple-500' }, // Defined below
                        { label: 'Accuracy', value: '74%', icon: Brain, color: 'text-pink-500' },
                    ].map((stat, i) => (
                        <div key={i} className={`p-6 rounded-2xl border ${theme.sidebar} ${theme.border} ${theme.shadow}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="flex items-center text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                    <ArrowUp className="w-3 h-3 mr-1" /> +12%
                                </span>
                            </div>
                            <h3 className={`text-3xl font-bold ${theme.text} mb-1`}>{stat.value}</h3>
                            <p className={theme.textMuted}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Subject Performance */}
                    <div className={`p-8 rounded-2xl border ${theme.sidebar} ${theme.border} ${theme.shadow}`}>
                        <h2 className={`text-xl font-bold mb-6 ${theme.text}`}>Subject Breakdown</h2>
                        <div className="space-y-6">
                            {performanceData.map(item => (
                                <div key={item.subject}>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className={theme.text}>{item.subject}</span>
                                        <span className={theme.textMuted}>{item.score}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${item.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weakness & Strengths */}
                    <div className="space-y-8">
                        <div className={`p-8 rounded-2xl border ${theme.sidebar} ${theme.border} ${theme.shadow}`}>
                            <h2 className={`text-xl font-bold mb-4 ${theme.text} flex items-center`}>
                                <Target className="w-5 h-5 mr-2 text-red-500" /> Improvement Areas
                            </h2>
                            <p className={`${theme.textMuted} mb-4 text-sm`}>Focus on these topics to boost your overall rank.</p>
                            <div className="flex flex-wrap gap-2">
                                {weaknesses.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={`p-8 rounded-2xl border ${theme.sidebar} ${theme.border} ${theme.shadow}`}>
                            <h2 className={`text-xl font-bold mb-4 ${theme.text} flex items-center`}>
                                <Award className="w-5 h-5 mr-2 text-yellow-500" /> Your Strengths
                            </h2>
                            <p className={`${theme.textMuted} mb-4 text-sm`}>You are crushing it in these areas! Keep it up.</p>
                            <div className="flex flex-wrap gap-2">
                                {strengths.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

const ClockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default AnalyticsPage;
