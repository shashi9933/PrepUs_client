import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Target, BarChart, Clock, Trophy } from 'lucide-react';

const DetailedFeatures = () => {
    const { theme } = useTheme();

    const keyFeatures = [
        {
            icon: Target,
            title: 'Exam-Specific Content',
            description: 'Curated questions aligned with your target exam pattern and syllabus'
        },
        {
            icon: BarChart,
            title: 'Performance Analytics',
            description: 'Detailed insights into your strengths, weaknesses, and progress over time'
        },
        {
            icon: Clock,
            title: 'Daily Practice',
            description: 'Fresh quiz content every day to build consistent study habits'
        },
        {
            icon: Trophy,
            title: 'Compete & Learn',
            description: 'Join leaderboards and compare your performance with peers'
        }
    ];

    return (
        <div className={`py-16 ${theme.sidebar} border-y ${theme.border} mt-12`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl font-bold mb-4 ${theme.text}`}>Why Choose GK Prep?</h2>
                    <p className={`max-w-2xl mx-auto ${theme.textMuted}`}>Comprehensive preparation tools designed to help you succeed in competitive exams.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {keyFeatures.map((feature, idx) => (
                        <div key={idx} className="text-center group">
                            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border ${theme.border} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-8 h-8 ${theme.name === 'Neon' ? 'text-cyan-400' : theme.name === 'Matrix' ? 'text-emerald-400' : 'text-blue-500'}`} />
                            </div>
                            <h3 className={`text-lg font-bold mb-3 ${theme.text}`}>{feature.title}</h3>
                            <p className={`text-sm leading-relaxed ${theme.textMuted}`}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailedFeatures;
