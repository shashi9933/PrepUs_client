import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader } from 'lucide-react';
import VideoLoader from '../components/VideoLoader';
import { fetchExamById } from '../services/api';

// Import section components
import FullMockSection from '../components/quiz-sections/FullMockSection';
import SectionalSection from '../components/quiz-sections/SectionalSection';
import BoosterSection from '../components/quiz-sections/BoosterSection';
import DailyDoseSection from '../components/quiz-sections/DailyDoseSection';

const QuizzesPage = () => {
    const { theme } = useTheme();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🎯 CORE RULE: Get exam from user.targetExam
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate('/login');
            return;
        }

        // Critical: User must have targetExam selected
        if (!user.targetExam) {
            console.warn('⚠️ User has no targetExam set');
            navigate('/onboarding');
            return;
        }

        const loadExamDetails = async () => {
            try {
                setLoading(true);
                console.log('📚 Loading exam details for:', user.targetExam);
                
                const examData = await fetchExamById(user.targetExam);
                
                if (!examData) {
                    throw new Error('Exam not found in database');
                }

                console.log('✅ Exam loaded:', {
                    title: examData.title,
                    mockTests: examData.mockTests?.length || 0,
                    syllabusSections: Object.keys(examData.syllabus || {}).length
                });

                setExam(examData);
                setError(null);
            } catch (err) {
                console.error('❌ Failed to load exam:', err);
                setError(err.message || 'Failed to load exam details');
            } finally {
                setLoading(false);
            }
        };

        loadExamDetails();
    }, [user, authLoading, navigate]);

    if (authLoading) return <VideoLoader />;

    if (!user) {
        return (
            <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>Please Login</h1>
                    <p className={theme.textMuted}>You need to be logged in to access quizzes.</p>
                </div>
            </div>
        );
    }

    if (!user.targetExam) {
        return (
            <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                    <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>Complete Your Profile</h1>
                    <p className={`${theme.textMuted} mb-8`}>Please select your target exam to access practice materials.</p>
                    <button
                        onClick={() => navigate('/onboarding')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        Go to Onboarding
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return <VideoLoader />;

    if (error) {
        return (
            <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                        <h2 className={`text-2xl font-bold mb-2 ${theme.text}`}>Error Loading Exam</h2>
                        <p className={theme.textMuted}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <h1 className={`text-4xl font-bold mb-2 ${theme.text}`}>
                        📚 Quiz Hub – {exam?.title}
                    </h1>
                    <p className={theme.textMuted}>
                        Structured practice with Full-length • Sectional • Booster • Daily Dose
                    </p>
                </div>

                {/* 4 Sections */}
                <div className="space-y-12">
                    {/* 1. Full Mock Tests */}
                    <FullMockSection exam={exam} examId={user.targetExam} theme={theme} />

                    {/* 2. Sectional Practice */}
                    <SectionalSection exam={exam} examId={user.targetExam} theme={theme} />

                    {/* 3. Booster Tests (Weak Areas) */}
                    <BoosterSection examId={user.targetExam} theme={theme} />

                    {/* 4. Daily Dose */}
                    <DailyDoseSection examId={user.targetExam} theme={theme} />
                </div>
            </div>
        </div>
    );
};

export default QuizzesPage;
