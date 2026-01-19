import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
    Award,
    Building2,
    Briefcase,
    Users,
    Train,
    Globe,
    Building,
    FileText
} from 'lucide-react';

const ExamCategories = () => {
    const { theme } = useTheme();

    // Added 'slug' for correct API filtering and routing
    const examCategories = [
        { icon: Award, title: 'UPSC', slug: 'upsc', subtitle: 'Competitive Exams' },
        { icon: Building2, title: 'SSC', slug: 'ssc', subtitle: 'Staff Selection' },
        { icon: Briefcase, title: 'Banking', slug: 'banking', subtitle: 'Exam-Focused' },
        { icon: Users, title: 'Defence', slug: 'defence', subtitle: 'Defence/ Forces' },
        { icon: Train, title: 'Railways', slug: 'railways', subtitle: 'RRB Exams' },
        { icon: Globe, title: 'State PSC', slug: 'public-service', subtitle: 'State Exams' }, // Slug matches backend category if needed
        { icon: Building, title: 'Insurance', slug: 'insurance', subtitle: 'LIC & Others' },
        { icon: FileText, title: 'Teaching', slug: 'teaching', subtitle: 'CTET & TET' }
    ];

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Explore Exams</h2>
                    <Link
                        to="/exams"
                        className={`text-sm font-medium ${theme.textMuted} hover:underline hover:opacity-100 transition-opacity`}
                    >
                        View All Exams →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {examCategories.map((exam) => (
                        <Link
                            key={exam.slug} // Stable key
                            to={`/exams?category=${exam.slug}`}
                            aria-label={`Explore ${exam.title} exams`}
                            className={`p-4 rounded-xl border ${theme.sidebar} ${theme.border} ${theme.shadow} hover:bg-white/10 transition-all group flex items-start space-x-4`}
                        >
                            <div className={`p-3 rounded-lg ${theme.isDark ? 'bg-white/5' : 'bg-gray-100'} ${theme.text}`}>
                                <exam.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`font-semibold ${theme.text} group-hover:text-blue-500 transition-colors`}>
                                    {exam.title}
                                </h3>
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
