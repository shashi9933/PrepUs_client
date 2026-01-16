import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Trophy, Medal, Award } from 'lucide-react';

const LeaderboardSection = () => {
    const { theme } = useTheme();

    const rankers = [
        { name: 'Rahul Sharma', score: 1432, rank: 1, icon: <Trophy className="w-5 h-5 text-yellow-500" /> },
        { name: 'Pooja Mehta', score: 1390, rank: 2, icon: <Medal className="w-5 h-5 text-gray-300" /> },
        { name: 'Vivek Singh', score: 1350, rank: 3, icon: <Award className="w-5 h-5 text-orange-400" /> },
    ];

    return (
        <div className={`p-6 rounded-3xl border ${theme.sidebar} ${theme.border} ${theme.shadow} h-full`}>
            <h2 className={`text-xl font-semibold mb-6 ${theme.text}`}>Compete & Secure Your Rank</h2>

            <div className="space-y-4">
                {rankers.map((ranker, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-xl bg-white/5 border ${theme.border} hover:bg-white/10 transition-colors`}>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                                {/* Avatar Placeholder */}
                                <span className="text-xs font-bold text-white">{ranker.name.charAt(0)}</span>
                            </div>
                            <span className={`font-medium ${theme.text}`}>{ranker.name}</span>
                        </div>

                        <div className="flex items-center space-x-6">
                            <span className={theme.textMuted}>{ranker.score}</span>
                            <div className="flex items-center space-x-2 w-16 justify-end">
                                <span className={`font-bold ${theme.text}`}>{ranker.score}</span>
                                {ranker.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardSection;
