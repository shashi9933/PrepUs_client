import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Trophy, Medal, Crown, TrendingUp, Search } from 'lucide-react';

const LeaderboardPage = () => {
    const { theme } = useTheme();
    const [period, setPeriod] = useState('Weekly');

    // Fake Data
    const topRankers = [
        { rank: 1, name: 'Aditi Sharma', points: 12500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi', badge: 'Grandmaster' },
        { rank: 2, name: 'Rahul Verma', points: 11800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', badge: 'Master' },
        { rank: 3, name: 'Sneha Gupta', points: 11200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', badge: 'Diamond' },
    ];

    const listRankers = Array.from({ length: 10 }).map((_, i) => ({
        rank: i + 4,
        name: `User ${i + 4}`,
        points: 10000 - (i * 500),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i + 4}`,
        change: Math.random() > 0.5 ? 'up' : 'down'
    }));

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-4xl mx-auto px-4">

                <div className="text-center mb-10">
                    <h1 className={`text-3xl font-bold mb-2 ${theme.text}`}>Global Leaderboard</h1>
                    <p className={theme.textMuted}>See where you stand among the best minds.</p>
                </div>

                {/* Period Toggle */}
                <div className="flex justify-center mb-12">
                    <div className={`p-1 rounded-full border ${theme.border} bg-white/5`}>
                        {['Daily', 'Weekly', 'All Time'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${period === p ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow' : `${theme.textMuted} hover:${theme.text}`
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top 3 Podium */}
                <div className="flex justify-center items-end mb-16 gap-4 md:gap-8">
                    {/* Rank 2 */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-4 border-gray-300 overflow-hidden mb-2 relative">
                            <img src={topRankers[1].avatar} alt="Rank 2" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gray-500 text-white text-[10px] text-center font-bold">#2</div>
                        </div>
                        <h3 className={`font-bold ${theme.text}`}>{topRankers[1].name}</h3>
                        <span className="text-sm font-mono text-gray-400">{topRankers[1].points} pts</span>
                    </div>
                    {/* Rank 1 */}
                    <div className="flex flex-col items-center -mt-8">
                        <Crown className="w-8 h-8 text-yellow-400 mb-2 animate-bounce" />
                        <div className="w-28 h-28 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 relative shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                            <img src={topRankers[0].avatar} alt="Rank 1" />
                            <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-white text-xs text-center font-bold py-0.5">#1</div>
                        </div>
                        <h3 className={`font-bold text-lg ${theme.text}`}>{topRankers[0].name}</h3>
                        <span className="text-sm font-mono text-yellow-500 font-bold">{topRankers[0].points} pts</span>
                    </div>
                    {/* Rank 3 */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-4 border-orange-700 overflow-hidden mb-2 relative">
                            <img src={topRankers[2].avatar} alt="Rank 3" />
                            <div className="absolute bottom-0 left-0 right-0 bg-orange-800 text-white text-[10px] text-center font-bold">#3</div>
                        </div>
                        <h3 className={`font-bold ${theme.text}`}>{topRankers[2].name}</h3>
                        <span className="text-sm font-mono text-gray-400">{topRankers[2].points} pts</span>
                    </div>
                </div>

                {/* Rest of the List */}
                <div className={`rounded-2xl border ${theme.sidebar} ${theme.border} overflow-hidden`}>
                    {listRankers.map((user) => (
                        <div key={user.rank} className={`flex items-center justify-between p-4 border-b ${theme.border} ${theme.sidebar} hover:bg-white/5 transition-colors`}>
                            <div className="flex items-center space-x-4">
                                <span className={`text-lg font-bold w-8 text-center ${theme.textMuted}`}>#{user.rank}</span>
                                <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full bg-white/10" />
                                <div>
                                    <h4 className={`font-semibold ${theme.text}`}>{user.name}</h4>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`font-mono font-bold ${theme.text}`}>{user.points}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default LeaderboardPage;
