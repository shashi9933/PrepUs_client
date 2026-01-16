import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Award, Building2, Briefcase, Users, Train, Globe, Building, FileText } from 'lucide-react';

const ExamCategories = () => {
    const { theme } = useTheme();

    const examCategories = [
        { icon: Award, title: 'UPSC', subtitle: 'Competitive Exams' },
        { icon: Building2, title: 'SSC', subtitle: 'Staff Selection' },
        { icon: Briefcase, title: 'Banking', subtitle: 'Exam-Focused' },
        { icon: Users, title: 'Defence', subtitle: 'Defence/ Forces' }, // Fixed duplicate title SSC -> Defence based on subtitle
        { icon: Train, title: 'Railways', subtitle: 'RRB Exams' },
        { icon: Globe, title: 'State PSC', subtitle: 'State Exams' },
        { icon: Building, title: 'Insurance', subtitle: 'LIC & Others' },
        { icon: FileText, title: 'Teaching', subtitle: 'CTET & TET' }
    ];

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Explore Exams</h2>
                    <Link to="/exams" className={`text-sm font-medium hover:underline ${theme.text} opacity-70 hover:opacity-100`}>
                        View All Exams →
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {examCategories.map((exam, idx) => (
                        <Link
                            to={`/exams?category=${encodeURIComponent(exam.title)}`}
                            key={idx}
                            className={`p-4 rounded-xl border ${theme.sidebar} ${theme.border} ${theme.shadow} hover:bg-white/5 transition-all cursor-pointer group flex items-start space-x-4`}
                        >
                            <div className={`p-3 rounded-lg bg-white/5 ${theme.text}`}>
                                <exam.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`font-semibold ${theme.text} group-hover:text-opacity-80`}>{exam.title}</h3>
                                <p className={`text-xs ${theme.textMuted}`}>{exam.subtitle}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExamCategories;
