import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Timer } from 'lucide-react';

const ExamPatternTable = ({ pattern }) => {
    const { theme } = useTheme();

    return (
        <div className={`p-6 rounded-xl border ${theme.sidebar} ${theme.border} ${theme.shadow} mb-8`}>
            <h2 className={`text-xl font-bold mb-6 ${theme.text}`}>Exam Pattern</h2>

            <div className="space-y-8">
                {pattern.map((phase, idx) => (
                    <div key={idx} className="overflow-hidden rounded-lg border border-gray-700/50">
                        {/* Phase Header */}
                        <div className={`px-6 py-3 ${theme.name === 'Neon' ? 'bg-cyan-900/30' : 'bg-blue-900/30'} flex justify-between items-center`}>
                            <h3 className={`font-bold ${theme.text}`}>{phase.phase}</h3>
                            <div className={`flex gap-4 text-xs font-medium ${theme.textMuted}`}>
                                <span>{phase.totalQuestions} Questions</span>
                                <span>{phase.totalMarks} Marks</span>
                                <span className="flex items-center"><Timer className="w-3 h-3 mr-1" />{phase.totalDuration}</span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className={`text-xs uppercase ${theme.textMuted} bg-white/5`}>
                                    <tr>
                                        <th className="px-6 py-3">Section</th>
                                        <th className="px-6 py-3 text-center">Questions</th>
                                        <th className="px-6 py-3 text-center">Marks</th>
                                        <th className="px-6 py-3 text-center">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y divide-gray-700/50 ${theme.text}`}>
                                    {phase.sections.map((sec, sIdx) => (
                                        <tr key={sIdx} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium">{sec.name}</td>
                                            <td className="px-6 py-4 text-center">{sec.questions}</td>
                                            <td className="px-6 py-4 text-center">{sec.marks}</td>
                                            <td className="px-6 py-4 text-center">{sec.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExamPatternTable;
