import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchExamById } from '../services/api';
import { ArrowLeft, Calendar, BookOpen, User, CheckCircle, Download, Share2 } from 'lucide-react';
import VideoLoader from '../components/VideoLoader';

// Detail Components
import ExamHeader from '../components/exam-detail/ExamHeader';
import ImportantDates from '../components/exam-detail/ImportantDates';
import EligibilityGrid from '../components/exam-detail/EligibilityGrid';
import ExamPatternTable from '../components/exam-detail/ExamPatternTable';
import { SyllabusSection, SalarySnapshot } from '../components/exam-detail/SyllabusSalary';

const ExamDetailPage = () => {
    const { examId } = useParams();
    const { theme } = useTheme();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchExamById(examId);
                setExam(data);
            } catch (error) {
                console.error("Failed to fetch exam:", error);
                setExam(null); // Ensure exam is null on error
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [examId]);

    if (loading) return <VideoLoader />;

    if (!exam) {
        return (
            <div className={`min-h-screen pt-24 text-center ${theme.bg}`}>
                <h1 className={theme.text}>Exam Not Found</h1>
                <Link to="/exams" className="text-blue-500 hover:underline">Back to All Exams</Link>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <Link to="/exams" className={`inline-flex items-center mb-6 text-sm ${theme.textMuted} hover:${theme.text}`}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Exams
                </Link>

                {/* 1. Header with Hero styling */}
                <ExamHeader exam={exam} />

                {/* 2. Important Dates Timeline */}
                <ImportantDates dates={exam.dates} />

                {/* 3. Eligibility Grid */}
                <EligibilityGrid eligibility={exam.eligibility} />

                {/* 4. Exam Pattern Table */}
                <ExamPatternTable pattern={exam.pattern} />

                {/* 5. Split Section: Syllabus & Salary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <SyllabusSection syllabus={exam.syllabus} theme={theme} />
                    <SalarySnapshot salary={exam.salary} theme={theme} />
                </div>

                {/* Actions / Next Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="study-plan" className={`p-6 rounded-xl border ${theme.border} hover:bg-blue-600/20 transition-colors ${theme.text} text-center font-bold text-lg group bg-white/5`}>
                        View Detailed Study Plan <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link to="mock-tests" className={`p-6 rounded-xl border ${theme.border} hover:bg-green-600/20 transition-colors ${theme.text} text-center font-bold text-lg group bg-white/5`}>
                        Attempt Mock Tests <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ExamDetailPage;
