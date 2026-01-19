import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchExamById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Play, Lock, Clock, Calendar, CheckCircle, Star, AlertCircle } from 'lucide-react';
import VideoLoader from '../components/VideoLoader';

const MockTestsPage = () => {
    const { examId } = useParams();
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchExamById(examId);
                setExam(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch mock tests", err);
                setError('Failed to load exam details.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [examId]);

    const handleStartTest = (testId, isFree) => {
        if (!isFree && !user?.isPremium) {
            navigate('/pricing'); // Or show upgrade modal
            return;
        }
        // Navigate to quiz with testId as URL parameter
        navigate(`/quiz/${testId}`);
    };

    if (loading) {
        return <VideoLoader />;
    }

    if (error) {
        return (
            <div className={`min-h-screen pt-24 ${theme.bg} flex items-center justify-center`}>
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className={theme.textMuted}>{error}</p>
                    <Link to="/exams" className="text-blue-500 hover:underline mt-4 block">Back to Exams</Link>
                </div>
            </div>
        );
    }

    if (!exam) return null;

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to={`/exams/${examId}`} className={`inline-flex items-center mb-6 text-sm ${theme.textMuted} hover:text-white transition-colors`}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to {exam.title}
                </Link>
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>Mock Tests: {exam.title}</h1>
                        <p className={theme.textMuted}>Practice with full-length mock tests designed by experts.</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {exam.mockTests?.map(test => {
                        const isLocked = test.type !== 'Free' && !user?.isPremium; // Simple lock logic
                        return (
                            <div key={test.id} className={`p-6 rounded-xl border ${theme.sidebar} ${theme.border} flex flex-col md:flex-row justify-between items-center gap-4 hover:border-blue-500/30 transition-colors`}>
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 rounded-lg ${test.type === 'Free' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                        {test.type === 'Free' ? <Play className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className={`font-bold text-lg ${theme.text}`}>{test.title}</h3>
                                            {test.type !== 'Free' && <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-medium">PREMIUM</span>}
                                        </div>
                                        <div className={`flex items-center space-x-4 mt-1 text-sm ${theme.textMuted}`}>
                                            <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> {test.questions} Questions</span>
                                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {test.time} Mins</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleStartTest(test.id, test.type === 'Free')}
                                    disabled={isLocked && false} // Ideally disabled, but let click handle redirect for upsell
                                    className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center space-x-2
                                        ${isLocked
                                            ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                        }`}
                                >
                                    {isLocked ? (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            <span>Unlock</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            <span>Start Now</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}

                    {(!exam.mockTests || exam.mockTests.length === 0) && (
                        <div className={`text-center py-12 border ${theme.border} rounded-xl border-dashed`}>
                            <p className={theme.textMuted}>No mock tests released for this exam yet. Check back later!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockTestsPage;
