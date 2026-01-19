import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Lock, Play } from 'lucide-react';

const FullMockSection = ({ exam, examId, theme }) => {
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);

    const mockTests = exam?.mockTests || [];

    if (!mockTests.length) {
        return (
            <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar}`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                    <BookOpen className="w-6 h-6 text-blue-500" />
                    📘 Full Mock Tests
                </h2>
                <p className={theme.textMuted}>No full mocks released yet. Check back soon!</p>
            </div>
        );
    }

    return (
        <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar}`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme.text}`}>
                <BookOpen className="w-6 h-6 text-blue-500" />
                📘 Full Mock Tests
            </h2>

            <div className="space-y-4">
                {mockTests.map((mock) => (
                    <div
                        key={mock.id}
                        onMouseEnter={() => setHoveredId(mock.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`p-4 rounded-xl border ${theme.border} flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group`}
                    >
                        <div>
                            <h3 className={`font-bold ${theme.text} group-hover:text-blue-400 transition-colors`}>
                                {mock.title}
                            </h3>
                            <p className={`text-sm ${theme.textMuted}`}>
                                {mock.questions} Questions • {mock.time} min
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                mock.type === 'Free'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-orange-500/20 text-orange-400'
                            }`}>
                                {mock.type === 'Free' ? '🟢 Free' : '🔒 Premium'}
                            </span>

                            {hoveredId === mock.id && (
                                <button
                                    onClick={() => navigate(`/quiz?testId=${mock.id}`)}
                                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-white"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FullMockSection;
