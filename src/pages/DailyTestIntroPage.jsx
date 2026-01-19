import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { fetchDailyTest } from '../services/api';
import { Play, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import VideoLoader from '../components/VideoLoader';

const DailyTestIntroPage = () => {
    const { examId } = useParams();
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [testData, setTestData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadDailyTest = async () => {
            try {
                const data = await fetchDailyTest(examId || user.targetExam || 'general');
                if (data && data._id) {
                    setTestData(data);
                } else {
                    throw new Error('No daily test available right now.');
                }
            } catch (err) {
                console.error("Daily Test Error:", err);
                setError(err.message || "Failed to load daily test.");
            } finally {
                setLoading(false);
            }
        };

        loadDailyTest();
    }, [examId, user, navigate]);

    const handleStart = () => {
        if (testData && testData._id) {
            navigate(`/quiz/${testData._id}`);
        }
    };

    if (loading) return <VideoLoader />;

    if (error) {
        return (
            <div className={`min-h-screen pt-24 ${theme.bg} flex flex-col items-center justify-center text-center p-4`}>
                <div className="p-6 rounded-full bg-red-500/10 mb-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${theme.text}`}>Daily Drill Unavailable</h2>
                <p className={`${theme.textMuted} mb-6`}>{error}</p>
                <button
                    onClick={() => navigate('/quizzes')}
                    className="px-6 py-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition"
                >
                    Try Practice Quizzes
                </button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-24 ${theme.bg} flex items-center justify-center p-4`}>
            <div className={`max-w-2xl w-full p-8 rounded-2xl border ${theme.border} ${theme.card} relative overflow-hidden`}>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-blue-500/10 text-blue-400 mb-6">
                        <Calendar className="w-8 h-8" />
                    </div>

                    <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>{testData.title}</h1>
                    <p className={`text-lg ${theme.textMuted} mb-8`}>
                        Sharpen your skills for <span className="font-semibold text-blue-400 capitalize">{testData.examId}</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className={`p-4 rounded-xl border ${theme.border} bg-white/5`}>
                            <div className={`text-sm ${theme.textMuted}`}>Questions</div>
                            <div className={`text-xl font-bold ${theme.text}`}>{testData.questions?.length || 0}</div>
                        </div>
                        <div className={`p-4 rounded-xl border ${theme.border} bg-white/5`}>
                            <div className={`text-sm ${theme.textMuted}`}>Est. Time</div>
                            <div className={`text-xl font-bold ${theme.text}`}>~10 min</div>
                        </div>
                        <div className={`p-4 rounded-xl border ${theme.border} bg-white/5`}>
                            <div className={`text-sm ${theme.textMuted}`}>Topic</div>
                            <div className={`text-xl font-bold ${theme.text}`}>{testData.topic || 'General'}</div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-8 text-left flex gap-3`}>
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-green-400 text-sm">Why take this?</h4>
                            <p className="text-xs text-green-300/80 mt-1">
                                Daily consistency is key to cracking competitive exams. This drill is generated freshly for today.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                        <Play className="w-5 h-5" /> Start Daily Drill
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyTestIntroPage;
