import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronRight, Shield, Globe, Trophy } from 'lucide-react';

const WeakAreasSection = () => {
    const { theme } = useTheme();

    const areas = [
        { name: 'Defense', icon: <Shield className="w-5 h-5 text-blue-400" /> },
        { name: 'Geography', icon: <Globe className="w-5 h-5 text-cyan-400" /> },
        { name: 'Sports', icon: <Trophy className="w-5 h-5 text-orange-400" /> },
    ];

    return (
        <div className={`p-6 rounded-3xl border ${theme.sidebar} ${theme.border} ${theme.shadow} h-full`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${theme.text}`}>Your Weak Areas</h2>
                <button className={`text-sm flex items-center ${theme.textMuted} hover:${theme.text}`}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>

            <div className="space-y-2 mb-6">
                {areas.map((area, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group`}>
                        <div className="flex items-center space-x-4">
                            {area.icon}
                            <span className={`${theme.text} font-medium`}>{area.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${theme.textMuted} group-hover:translate-x-1 transition-transform`} />
                    </div>
                ))}
            </div>

            {/* Mini Chart Area */}
            <div className={`mt-auto p-4 rounded-xl bg-white/5 border ${theme.border} flex items-end justify-between h-24 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                <span className={`text-sm font-medium ${theme.text} relative z-10`}>Quiz Performance included</span>
                <div className="flex items-end space-x-1 h-full pb-2 relative z-10">
                    <div className="w-2 bg-blue-500/50 rounded-t h-1/3"></div>
                    <div className="w-2 bg-blue-500/50 rounded-t h-1/2"></div>
                    <div className="w-2 bg-orange-500 rounded-t h-2/3"></div>
                    <div className="w-2 bg-blue-500/50 rounded-t h-1/4"></div>
                </div>
            </div>
        </div>
    );
};

export default WeakAreasSection;
