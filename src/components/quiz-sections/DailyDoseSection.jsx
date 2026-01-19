import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader, Play, AlertCircle } from 'lucide-react';
import { fetchDailyTest } from '../../services/api';

const DailyDoseSection = ({ examId, theme }) => {
    const navigate = useNavigate();
    const [dailyTest, setDailyTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDailyTest = async () => {
            try {
                setLoading(true);
                console.log('📅 Fetching daily test for exam:', examId);

                const test = await fetchDailyTest(examId);

                if (test && test._id) {
                    console.log('✅ Daily test loaded:', { id: test._id, questions: test.questions?.length });
                    setDailyTest(test);
                    setError(null);
                } else {
                    throw new Error('No daily test available');
                }
            } catch (err) {
                console.error('❌ Failed to load daily test:', err);
                setError(err.message);
                setDailyTest(null);
            } finally {
                setLoading(false);
            }
        };

        if (examId) {
            loadDailyTest();
        }
    }, [examId]);

    if (loading) {
        return (
            <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar}`}>
                <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>📅 Daily Dose</h2>
                <Loader className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    if (error || !dailyTest) {
        return (
            <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar} bg-red-500/10 border-red-500/20`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    📅 Daily Dose
                </h2>
                <p className={theme.textMuted}>{error || 'Failed to load daily test'}</p>
            </div>
        );
    }

    return (
        <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar} bg-gradient-to-r from-blue-500/10 to-cyan-500/10`}>
            <h2 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${theme.text}`}>
                <Calendar className="w-6 h-6 text-blue-500" />
                📅 Daily Dose – Today
            </h2>
            <p className={`text-sm ${theme.textMuted} mb-6`}>
                Quick daily practice to keep your streak going
            </p>

            {/* Test Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`p-4 rounded-lg bg-white/5 border ${theme.border}`}>
                    <p className={`text-xs ${theme.textMuted}`}>Questions</p>
                    <p className={`text-2xl font-bold ${theme.text}`}>{dailyTest.questions?.length || 10}</p>
                </div>
                <div className={`p-4 rounded-lg bg-white/5 border ${theme.border}`}>
                    <p className={`text-xs ${theme.textMuted}`}>Duration</p>
                    <p className={`text-2xl font-bold ${theme.text}`}>~{dailyTest.duration || 10} min</p>
                </div>
                <div className={`p-4 rounded-lg bg-white/5 border ${theme.border}`}>
                    <p className={`text-xs ${theme.textMuted}`}>Topic</p>
                    <p className={`text-lg font-bold ${theme.text}`}>{dailyTest.topic || 'General'}</p>
                </div>
            </div>

            {/* Start Button */}
            <button
                onClick={() => navigate(`/quiz/${dailyTest._id}`)}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                }`}
            >
                <Play className="w-5 h-5 fill-current" />
                Start Daily Dose
            </button>

            {/* Streak Info */}
            <p className={`text-xs ${theme.textMuted} text-center mt-4`}>
                ⚡ Complete today's daily dose to maintain your streak
            </p>
        </div>
    );
};

export default DailyDoseSection;
