import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchExamById } from '../services/api';
import { ArrowLeft, BookOpen, Clock, Calendar, CheckCircle, Lock, Target, AlertCircle } from 'lucide-react';
import VideoLoader from '../components/VideoLoader';

const StudyPlanPage = () => {
    const { examId } = useParams();
    const { theme } = useTheme();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchExamById(examId);
            setExam(data);
            setLoading(false);
        };
        loadData();
    }, [examId]);

    if (loading) {
        return <VideoLoader fullScreen={false} />;
    }

    if (!exam) return null;

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to={`/exams/${examId}`} className={`inline-flex items-center mb-6 text-sm ${theme.textMuted} hover:${theme.text}`}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to {exam.title}
                </Link>
                <h1 className={`text-3xl font-bold ${theme.text} mb-4`}>Study Plan: {exam.title}</h1>

                <div className={`p-8 rounded-xl border ${theme.sidebar} ${theme.border} ${theme.shadow} text-center`}>
                    <p className={theme.textMuted}>Customized study plan content will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default StudyPlanPage;
