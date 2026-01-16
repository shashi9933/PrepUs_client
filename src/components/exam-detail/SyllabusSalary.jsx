import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, ChevronUp, Briefcase, TrendingUp } from 'lucide-react';

const SyllabusSection = ({ syllabus, theme }) => {
    const [expandedSubject, setExpandedSubject] = useState(null);

    const toggleSubject = (subject) => {
        setExpandedSubject(expandedSubject === subject ? null : subject);
    };

    return (
        <div className={`p-6 rounded-xl border ${theme.sidebar} ${theme.border} h-full`}>
            <h2 className={`text-xl font-bold mb-6 ${theme.text}`}>Syllabus Highlights</h2>
            <div className="space-y-3">
                {Object.entries(syllabus).map(([subject, topics]) => (
                    <div key={subject} className="rounded-lg border border-gray-700/30 overflow-hidden">
                        <button
                            onClick={() => toggleSubject(subject)}
                            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors text-left"
                        >
                            <span className={`font-semibold ${theme.text}`}>{subject}</span>
                            {expandedSubject === subject ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {expandedSubject === subject && (
                            <div className="p-4 bg-black/20">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {topics.map((topic, idx) => (
                                        <li key={idx} className={`flex items-start text-sm ${theme.textMuted}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0`}></span>
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SalarySnapshot = ({ salary, theme }) => {
    return (
        <div className={`p-6 rounded-xl border ${theme.sidebar} ${theme.border} h-full bg-gradient-to-br from-white/5 to-transparent`}>
            <h2 className={`text-xl font-bold mb-6 ${theme.text} flex items-center`}>
                <Briefcase className="w-5 h-5 mr-2 text-green-400" />
                Salary & Perks
            </h2>

            <div className="space-y-6">
                {/* Main Numbers */}
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                    <p className="text-sm text-green-400 uppercase tracking-widest mb-1">In-Hand Salary</p>
                    <p className={`text-3xl font-bold ${theme.name === 'Matrix' ? 'text-green-400' : 'text-white'}`}>₹ {salary.inHand}</p>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded bg-white/5">
                        <p className={theme.textMuted}>Basic Pay</p>
                        <p className={`font-semibold ${theme.text}`}>₹ {salary.basic}</p>
                    </div>
                    <div className="p-3 rounded bg-white/5">
                        <p className={theme.textMuted}>Gross Salary</p>
                        <p className={`font-semibold ${theme.text}`}>₹ {salary.gross}</p>
                    </div>
                </div>

                {/* Allowances */}
                <div>
                    <p className={`text-xs font-bold uppercase ${theme.textMuted} mb-3`}>Key Allowances</p>
                    <div className="flex flex-wrap gap-2">
                        {salary.allowances.map((allowance, idx) => (
                            <span key={idx} className={`text-xs px-2 py-1 rounded bg-white/5 border border-white/10 ${theme.text}`}>
                                {allowance}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Career Growth */}
                <div className="pt-4 border-t border-dashed border-gray-700">
                    <div className="flex items-center mb-2">
                        <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                        <span className={`font-bold text-sm ${theme.text}`}>Career Growth</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${theme.textMuted}`}>
                        {salary.careerGrowth}
                    </p>
                </div>
            </div>
        </div>
    );
};

export { SyllabusSection, SalarySnapshot };
