import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchExamById } from '../services/api';
import { ArrowLeft, Play, Lock, Clock, Calendar, CheckCircle, Star } from 'lucide-react';
import VideoLoader from '../components/VideoLoader';

const MockTestsPage = () => {
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
        return <VideoLoader />;
    }

    if (!exam) return null;

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to={`/exams/${examId}`} className={`inline-flex items-center mb-6 text-sm ${theme.textMuted} hover:${theme.text}`}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to {exam.title}
                </Link>
                <h1 className={`text-3xl font-bold ${theme.text} mb-4`}>Mock Tests: {exam.title}</h1>

                <div className="grid gap-4">
                    {exam.mockTests?.map(test => (
                        <div key={test.id} className={`p-6 rounded-xl border ${theme.sidebar} ${theme.border} flex justify-between items-center`}>
                            <div>
                                <h3 className={`font-bold ${theme.text}`}>{test.title}</h3>
                                <p className={`text-sm ${theme.textMuted}`}>{test.questions} Qs • {test.time} Min</p>
                            </div>
                            <button className={`px-4 py-2 rounded-lg ${test.type === 'Free' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                {test.type === 'Free' ? 'Start Now' : 'Unlock'}
                            </button>
                        </div>
                    ))}
                    {(!exam.mockTests || exam.mockTests.length === 0) && (
                        <p className={theme.textMuted}>No mock tests released yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockTestsPage;
