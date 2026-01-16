import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Radio, BarChart2, MessageCircleQuestion } from 'lucide-react';

const FeaturesSection = () => {
    const { theme } = useTheme();

    const features = [
        {
            icon: <Radio className="w-8 h-8 text-blue-400" />,
            title: "DAILY LIVE QUIZZES",
            count: "400+",
            desc: "Questions Today",
            color: "from-blue-500/20 to-blue-600/5",
        },
        {
            icon: <BarChart2 className="w-8 h-8 text-green-400" />,
            title: "PERSONALIZED ANALYTICS",
            count: "Track",
            desc: "Your Progress",
            color: "from-green-500/20 to-green-600/5",
        },
        {
            icon: <MessageCircleQuestion className="w-8 h-8 text-orange-400" />,
            title: "UNLIMITED PRACTICE",
            count: "10,000+",
            desc: "Exam-Focused Questions",
            color: "from-orange-500/20 to-orange-600/5",
        }
    ];

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-xl font-semibold mb-6 ${theme.text}`}>Key Features</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className={`relative p-6 rounded-2xl border ${theme.border} ${theme.sidebar} ${theme.shadow} overflow-hidden group hover:border-opacity-50 transition-colors`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                            <div className="relative flex items-center space-x-4">
                                <div className={`p-3 rounded-xl bg-white/5 border ${theme.border}`}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm tracking-wider ${theme.text}`}>{feature.title}</h3>
                                    <div className={theme.textMuted}>
                                        <span className={`block text-lg font-bold ${feature.color.split(' ')[1].replace('/5', '500').replace('to-', 'text-')}`}>{feature.count}</span>
                                        <span className="text-xs">{feature.desc}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
