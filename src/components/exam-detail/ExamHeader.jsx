import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MapPin, Users, Globe, Play, Award, Building2, Briefcase, Train, Building, FileText } from 'lucide-react';

const iconMap = {
    'Banking': Briefcase,
    'SSC': Building2,
    'Defence': Users,
    'Railways': Train,
    'State PSC': Globe,
    'Insurance': Building,
    'Teaching': FileText,
    'UPSC': Award,
    'Regulatory': Building // RBI
};

// Pill Component for Quick Info
const InfoPill = ({ label, value, theme }) => (
    <div className={`px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border ${theme.border} flex flex-col items-center justify-center min-w-[100px] hover:bg-white/20 transition-colors`}>
        <span className="text-[10px] uppercase tracking-wider opacity-70 mb-1">{label}</span>
        <span className="font-semibold text-sm">{value}</span>
    </div>
);

const ExamHeader = ({ exam }) => {
    const { theme } = useTheme();
    const Icon = iconMap[exam.category] || Award; // Default Icon

    return (
        <div className={`w-full rounded-2xl p-8 mb-8 relative overflow-hidden ${theme.name === 'Neon' ? 'bg-gradient-to-r from-cyan-900 to-blue-900' :
            theme.name === 'Matrix' ? 'bg-gradient-to-r from-emerald-900 to-green-900' :
                'bg-gradient-to-r from-blue-600 to-indigo-700'
            } text-white shadow-xl`}>

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-4 p-4 rounded-full bg-white/20 backdrop-blur-md shadow-inner">
                    <Icon className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                    {exam.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8 font-light max-w-2xl">
                    {exam.subtitle}
                </p>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-4 justify-center w-full overflow-x-auto pb-6 scrollbar-hide">
                    <InfoPill label="Body" value={exam.quickInfo.conductingBody} theme={theme} />
                    <InfoPill label="Level" value={exam.quickInfo.level} theme={theme} />
                    <InfoPill label="Mode" value={exam.quickInfo.mode} theme={theme} />
                    <InfoPill label="Frequency" value={exam.quickInfo.frequency} theme={theme} />
                    <InfoPill label="Vacancies" value={exam.quickInfo.vacancies} theme={theme} />
                </div>

                {/* Primary CTA: Start Daily Drill */}
                <a href={`/quiz?exam=${exam.id}`} className="inline-flex items-center px-8 py-3 bg-white text-blue-900 rounded-full font-bold shadow-lg hover:bg-gray-100 hover:scale-105 transition-all text-lg">
                    <Play className="w-5 h-5 mr-2 fill-current" /> Start Daily Drill
                </a>
            </div>
        </div>
    );
};

export default ExamHeader;
