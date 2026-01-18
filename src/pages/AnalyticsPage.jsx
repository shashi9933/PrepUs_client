import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { fetchAnalytics } from '../services/api';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
    BarChart, Bar, Cell, PieChart, Pie, RadialBarChart, RadialBar, Legend
} from 'recharts';
import {
    Activity, TrendingUp, Target, Clock, AlertTriangle, CheckCircle,
    Zap, Calendar, BookOpen, AlertCircle, ArrowUp, ArrowRight
} from 'lucide-react';

const AnalyticsPage = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d

    useEffect(() => {
        if (user?.id) {
            loadAnalytics();
        }
    }, [user, timeRange]);

    const loadAnalytics = async () => {
        setLoading(true);
        // ideally pass timeRange to API, for now basic fetch
        const res = await fetchAnalytics(user.id);
        setData(res);
        setLoading(false);
    };

    if (loading) return <div className={`min-h-screen pt-24 ${theme.bg} flex justify-center text-white`}>Loading Insights...</div>;

    if (!data || data.isNewUser) return (
        <div className={`min-h-screen pt-24 ${theme.bg} text-white flex flex-col items-center justify-center p-4`}>
            <Activity className="w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-3xl font-bold mb-2">No Data Yet</h2>
            <p className="text-gray-400 text-center max-w-md mb-8">
                Start your first test to unlock detailed analytics and personalized insights.
            </p>
            <a href="/exams" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition-all">
                Start a Mock Test
            </a>
        </div>
    );

    // --- Helpers / Constants ---
    const readinessColor = data.readiness.score >= 70 ? '#10B981' : data.readiness.score >= 40 ? '#F59E0B' : '#EF4444';

    const donutData = Object.entries(data.subjects).map(([name, stats]) => ({
        name, value: stats.total
    }));

    return (
        <div className={`min-h-screen pt-20 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* 1. Header & Snapshot */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className={`text-3xl font-bold ${theme.text}`}>Analytics Dashboard</h1>
                        <p className={theme.textMuted}>Welcome back, {user.name}. Here is your prepration overview.</p>
                    </div>
                    {/* Global Filters */}
                    <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                        {['7d', '30d', '90d'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${timeRange === range ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Top Snapshot Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SnapshotCard icon={Activity} label="Tests Taken" value={data.overview.testsTaken} theme={theme} color="blue" />
                    <SnapshotCard icon={Zap} label="Current Streak" value={`${data.user.streak} Days`} theme={theme} color="yellow" />
                    <SnapshotCard icon={Target} label="Avg Accuracy" value={`${data.overview.accuracy}%`} theme={theme} color="green" />
                    <SnapshotCard icon={Clock} label="Active Days" value={Object.keys(data.activityMap || {}).length} theme={theme} color="purple" />
                </div>

                {/* 3. Main Split: Readiness vs Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Exam Readiness Ring */}
                    <div className={`col-span-1 p-6 rounded-2xl border ${theme.border} ${theme.card} flex flex-col items-center justify-center relative overflow-hidden`}>
                        <h3 className={`text-xl font-bold mb-6 ${theme.text} self-start`}>Exam Readiness</h3>

                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Recharts Radial Bar for Ring Effect */}
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    innerRadius="80%" outerRadius="100%"
                                    data={[{ name: 'Score', value: parseInt(data.readiness.score), fill: readinessColor }]}
                                    startAngle={180} endAngle={0}
                                    cy="60%"
                                >
                                    <RadialBar background clockWise={true} dataKey="value" cornerRadius={10} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-4">
                                <span className="text-5xl font-bold" style={{ color: readinessColor }}>{data.readiness.score}%</span>
                                <p className={`text-sm ${theme.textMuted} mt-1`}>{data.readiness.status}</p>
                            </div>
                        </div>

                        <div className="mt-4 text-center px-4">
                            <p className={theme.textMuted}>Target: <span className="text-blue-400 font-semibold">{data.readiness.exam.toUpperCase()}</span></p>
                            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
                                💡 At this pace, you need <strong>~45 more hours</strong> of practice to reach the top 10%.
                            </div>
                        </div>
                    </div>

                    {/* Right: Performance Trends */}
                    <div className={`col-span-1 lg:col-span-2 p-6 rounded-2xl border ${theme.border} ${theme.card}`}>
                        <h3 className={`text-xl font-bold mb-6 ${theme.text}`}>Performance Trends</h3>
                        <div className="h-64 md:h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.trends}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.4} />
                                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                        itemStyle={{ color: '#F3F4F6' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="Score" />
                                    <Area type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" name="Accuracy %" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 4. Subject Analytics & Weak Areas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Subject Breakdown */}
                    <div className={`p-6 rounded-2xl border ${theme.border} ${theme.card}`}>
                        <h3 className={`text-xl font-bold mb-6 ${theme.text}`}>Subject Breakdown</h3>
                        <div className="space-y-4">
                            {Object.entries(data.subjects).map(([subject, stats]) => {
                                const acc = (stats.correct / stats.total) * 100;
                                return (
                                    <div key={subject}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300 font-medium">{subject}</span>
                                            <span className={acc > 70 ? 'text-green-400' : acc > 40 ? 'text-yellow-400' : 'text-red-400'}>{acc.toFixed(0)}% Accuracy</span>
                                        </div>
                                        <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${acc > 70 ? 'bg-green-500' : acc > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${acc}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{stats.total} questions attempted</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Deep Weak Areas */}
                    <div className={`p-6 rounded-2xl border ${theme.border} ${theme.card}`}>
                        <h3 className={`flex items-center gap-2 text-xl font-bold mb-6 ${theme.text}`}>
                            <AlertTriangle className="w-6 h-6 text-red-500" /> Weakest Topics
                        </h3>
                        {data.weakAreas.length > 0 ? (
                            <div className="space-y-4">
                                {data.weakAreas.map((topic, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <div>
                                            <h4 className="font-semibold text-red-200">{topic.name}</h4>
                                            <p className="text-xs text-red-300/70">{topic.total} Attempts • {topic.accuracy.toFixed(0)}% Accuracy</p>
                                        </div>
                                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors">
                                            Revise
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <CheckCircle className="w-10 h-10 mb-2 text-green-500" />
                                <p>No major weak areas found yet!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Recommended / Available Quizzes */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-xl font-bold ${theme.text}`}>Available For You</h3>
                        <a href="/quizzes" className="text-sm text-blue-500 hover:underline">View All</a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Quantitative Aptitude', 'Reasoning Ability', 'English Language'].map((topic, i) => (
                            <div key={i} className={`p-4 rounded-xl border ${theme.border} ${theme.card} hover:border-blue-500/50 transition-colors group cursor-pointer`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">15 Q • 15m</span>
                                </div>
                                <h4 className={`font-bold ${theme.text} mb-1 group-hover:text-blue-400 transition-colors`}>{topic}</h4>
                                <p className="text-xs text-gray-500 mb-4">Practice Drill</p>
                                <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors text-white">
                                    Start Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. Mistake Intelligence */}
                <div className={`p-6 rounded-2xl border ${theme.border} ${theme.card} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <h3 className={`text-xl font-bold mb-6 ${theme.text}`}>Mistake Intelligence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Mistake Distribution Chart */}
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={Object.entries(data.mistakeProfile || {}).map(([k, v]) => ({ name: k, value: v }))} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                    <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} fontSize={12} />
                                    <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }} />
                                    <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Insights Text */}
                        <div className="col-span-2 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <h4 className="text-sm text-gray-400 mb-1">Most Common Error</h4>
                                    <span className="text-lg font-bold text-white">Conceptual Error</span>
                                    <p className="text-xs text-gray-500 mt-2">Occurs when you spend &gt; 2 mins per question.</p>
                                </div>
                                <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <h4 className="text-sm text-gray-400 mb-1">Silly Mistakes</h4>
                                    <span className="text-lg font-bold text-yellow-400">12</span>
                                    <p className="text-xs text-gray-500 mt-2">Questions answered in &lt; 5 seconds.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-4">
                                <AlertCircle className="w-8 h-8 text-blue-400" />
                                <div>
                                    <h4 className="font-bold text-blue-100">Recommendation</h4>
                                    <p className="text-sm text-blue-200/80">You are rushing through initial questions. Slow down by 5 seconds per question to reduce silly errors.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Improvement Hub - Sticky Actions */}
                <div className="sticky bottom-4 z-50">
                    <div className="max-w-3xl mx-auto bg-gray-900/90 backdrop-blur-md border border-white/20 text-white p-2 rounded-2xl shadow-2xl flex justify-between items-center px-4 md:px-6 py-3">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg animate-pulse">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Next Best Action</p>
                                <p className="font-bold text-sm md:text-base">Practice <span className="text-pink-400">Banking Awareness</span> (Weak Area)</p>
                            </div>
                        </div>
                        <button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                            Start Drill <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div >
    );
};

const SnapshotCard = ({ icon: Icon, label, value, theme, color }) => {
    const colorClasses = {
        blue: "text-blue-400 bg-blue-500/10",
        yellow: "text-yellow-400 bg-yellow-500/10",
        green: "text-green-400 bg-green-500/10",
        purple: "text-purple-400 bg-purple-500/10"
    };

    return (
        <div className={`p-4 rounded-xl border ${theme.border} ${theme.card} flex flex-col justify-between h-32`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className={`text-2xl font-bold ${theme.text}`}>{value}</p>
                <p className={`text-sm ${theme.textMuted}`}>{label}</p>
            </div>
        </div>
    );
};

export default AnalyticsPage;
