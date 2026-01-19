import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { fetchAnalytics } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
    BarChart, Bar, RadialBarChart, RadialBar
} from 'recharts';
import {
    Activity, Target, Clock, AlertTriangle, CheckCircle,
    Zap, BookOpen, AlertCircle, ArrowRight
} from 'lucide-react';
import VideoLoader from '../components/VideoLoader';

const AnalyticsPage = () => {
    const { theme } = useTheme();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d

    useEffect(() => {
        if (!authLoading && user?.id) {
            loadAnalytics();
        }
    }, [authLoading, user, timeRange]);

    const loadAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchAnalytics(user.id, timeRange);
            setData(res);
        } catch (err) {
            console.error(err);
            setData(null);
            setError("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    // --- Data Normalization & Safeties ---
    const normalizedData = useMemo(() => {
        if (!data) return null;
        return {
            overview: data.overview || {},
            readiness: { score: 0, status: 'N/A', exam: 'N/A', ...data.readiness },
            trends: data.trends || [],
            subjects: data.subjects || {},
            weakAreas: data.weakAreas || [],
            mistakeProfile: data.mistakeProfile || {},
            user: { streak: 0, ...data.user },
            activityMap: data.activityMap || {}
        };
    }, [data]);

    if (authLoading || loading) return <VideoLoader />;

    // Fallback UI for new users or error
    if (error || !normalizedData || normalizedData.isNewUser) {
        return (
            <div className={`min-h-screen pt-24 ${theme.bg} text-white flex flex-col items-center justify-center p-4`}>
                <Activity className={`w-16 h-16 ${error ? 'text-red-500' : 'text-blue-500'} mb-4`} />
                <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>{error ? 'Oops!' : 'No Data Yet'}</h2>
                <p className={`${theme.textMuted} text-center max-w-md mb-8`}>
                    {error ? 'We encountered an error loading your insights.' : 'Start your first test to unlock detailed analytics and personalized insights.'}
                </p>
                <div className="flex space-x-4">
                    {error ? (
                        <button onClick={() => loadAnalytics()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                            Retry
                        </button>
                    ) : (
                        <Link to="/exams" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                            Start a Mock Test
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    const { overview, readiness, trends, subjects, weakAreas, mistakeProfile, user: userStats, activityMap } = normalizedData;
    const readinessColor = readiness.score >= 70 ? '#10B981' : readiness.score >= 40 ? '#F59E0B' : '#EF4444';

    return (
        <div className={`min-h-screen pt-20 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-32">

                {/* 1. Header & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className={`text-3xl font-bold ${theme.text}`}>Analytics Dashboard</h1>
                        <p className={theme.textMuted}>Welcome back, {user.name}. Here is your preparation overview.</p>
                    </div>
                    <div className="flex bg-white/5 rounded-lg p-1 gap-1 border border-white/10">
                        {['7d', '30d', '90d'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${timeRange === range ? 'bg-blue-600 text-white shadow-lg' : `${theme.textMuted} hover:${theme.text}`}`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Top Snapshot Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SnapshotCard icon={Activity} label="Tests Taken" value={overview.testsTaken || 0} theme={theme} color="blue" />
                    <SnapshotCard icon={Zap} label="Current Streak" value={`${userStats.streak} Days`} theme={theme} color="yellow" />
                    <SnapshotCard icon={Target} label="Avg Accuracy" value={`${overview.accuracy || 0}%`} theme={theme} color="green" />
                    <SnapshotCard icon={Clock} label="Active Days" value={Object.keys(activityMap).length} theme={theme} color="purple" />
                </div>

                {/* 3. Main Split: Readiness vs Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Exam Readiness Ring */}
                    <div className={`col-span-1 p-6 rounded-2xl border ${theme.border} ${theme.card} flex flex-col items-center justify-center relative overflow-hidden`}>
                        <h3 className={`text-xl font-bold mb-6 ${theme.text} self-start`}>Exam Readiness</h3>
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    innerRadius="80%" outerRadius="100%"
                                    data={[{ name: 'Score', value: parseInt(readiness.score), fill: readinessColor }]}
                                    startAngle={90} endAngle={-270}
                                    cy="50%" cx="50%"
                                >
                                    <RadialBar background clockWise={true} dataKey="value" cornerRadius={10} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="text-5xl font-bold" style={{ color: readinessColor }}>{readiness.score}%</span>
                                <p className={`text-sm ${theme.textMuted} mt-1`}>{readiness.status}</p>
                            </div>
                        </div>
                        <div className="mt-4 text-center px-4 w-full">
                            <p className={theme.textMuted}>Target: <span className="text-blue-400 font-semibold">{String(readiness.exam || '').toUpperCase()}</span></p>
                        </div>
                    </div>

                    {/* Right: Performance Trends */}
                    <div className={`col-span-1 lg:col-span-2 p-6 rounded-2xl border ${theme.border} ${theme.card}`}>
                        <h3 className={`text-xl font-bold mb-6 ${theme.text}`}>Performance Trends</h3>
                        <div className="h-64 md:h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends}>
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
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.isDark ? "#374151" : "#E5E7EB"} opacity={0.4} />
                                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: theme.isDark ? '#1F2937' : '#FFFFFF', borderColor: theme.border, color: theme.text }}
                                        itemStyle={{ color: theme.text }}
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
                            {Object.entries(subjects).map(([subject, stats]) => {
                                const acc = stats.total ? (stats.correct / stats.total) * 100 : 0;
                                return (
                                    <div
                                        key={subject}
                                        onClick={() => navigate(`/exams?q=${encodeURIComponent(subject)}`)}
                                        className="group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                                    >
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className={`${theme.text} font-medium group-hover:text-blue-400 transaction-colors`}>{subject}</span>
                                            <span className={acc > 70 ? 'text-green-400' : acc > 40 ? 'text-yellow-400' : 'text-red-400'}>{acc.toFixed(0)}% Accuracy</span>
                                        </div>
                                        <div className="w-full bg-gray-700/50 h-2.5 rounded-full overflow-hidden">
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

                    {/* Weak Areas */}
                    <div className={`p-6 rounded-2xl border ${theme.border} ${theme.card}`}>
                        <h3 className={`flex items-center gap-2 text-xl font-bold mb-6 ${theme.text}`}>
                            <AlertTriangle className="w-6 h-6 text-red-500" /> Weakest Topics
                        </h3>
                        {weakAreas.length > 0 ? (
                            <div className="space-y-4">
                                {weakAreas.map((topic, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <div>
                                            <h4 className="font-semibold text-red-400">{topic.name}</h4>
                                            <p className="text-xs text-red-400/70">{topic.total} Attempts • {topic.accuracy.toFixed(0)}% Accuracy</p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/exams?q=${encodeURIComponent(topic.name)}`)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                                        >
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

                {/* 5. Available Quizzes (Driven by Recommendation Logic if available) */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-xl font-bold ${theme.text}`}>Recommended Practice</h3>
                        <Link to="/exams" className="text-sm text-blue-500 hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Placeholder Recommendations - ideally from API */}
                        {['Quantitative Aptitude', 'Reasoning Ability', 'English Language'].map((topic, i) => (
                            <div key={i} onClick={() => navigate('/exams')} className={`p-4 rounded-xl border ${theme.border} ${theme.card} hover:border-blue-500/50 transition-colors group cursor-pointer`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-mono text-gray-500 px-2 py-1 rounded bg-black/20">Practice</span>
                                </div>
                                <h4 className={`font-bold ${theme.text} mb-1 group-hover:text-blue-400 transition-colors`}>{topic}</h4>
                                <p className={`text-xs ${theme.textMuted} mb-4`}>Boost your score in this section.</p>
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
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={Object.entries(mistakeProfile).map(([k, v]) => ({ name: k, value: v }))} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.isDark ? "#374151" : "#E5E7EB"} horizontal={false} />
                                    <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} fontSize={12} />
                                    <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: theme.isDark ? '#1F2937' : '#FFFFFF', borderColor: theme.border }} />
                                    <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="col-span-2 space-y-4">
                            {/* Dynamic Insights based on data */}
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-4">
                                <AlertCircle className="w-8 h-8 text-blue-400" />
                                <div>
                                    <h4 className="font-bold text-blue-400">Analysis</h4>
                                    <p className={`text-sm ${theme.textMuted}`}>Your mistake patterns helps us personalize test generation. Keep practising to improve accuracy.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. Action Bar - Sticky */}
                <div className="sticky bottom-4 z-40">
                    <div className="max-w-3xl mx-auto bg-gray-900/95 backdrop-blur-md border border-white/20 text-white p-2 rounded-2xl shadow-2xl flex justify-between items-center px-4 md:px-6 py-3">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg animate-pulse">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Next Best Action</p>
                                <p className="font-bold text-sm md:text-base">
                                    {weakAreas.length > 0 ? `Revise ${weakAreas[0].name}` : 'Take a Full Mock Test'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(weakAreas.length > 0 ? `/exams?q=${encodeURIComponent(weakAreas[0].name)}` : '/exams')}
                            className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                        >
                            Start <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Memoized Snapshot Card for Performance
const SnapshotCard = React.memo(({ icon: Icon, label, value, theme, color }) => {
    const colorClasses = {
        blue: "text-blue-400 bg-blue-500/10",
        yellow: "text-yellow-400 bg-yellow-500/10",
        green: "text-green-400 bg-green-500/10",
        purple: "text-purple-400 bg-purple-500/10"
    };

    return (
        <div className={`p-4 rounded-xl border ${theme.border} ${theme.card} flex flex-col justify-between h-32 hover:scale-[1.02] transition-transform`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className={`text-2xl font-bold ${theme.text}`}>{value}</p>
                <p className={`text-sm ${theme.textMuted}`}>{label}</p>
            </div>
        </div>
    );
});

export default AnalyticsPage;
