import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Play } from 'lucide-react';
import { generateTest } from '../../services/api';

const SectionalSection = ({ exam, examId, theme }) => {
    const navigate = useNavigate();
    const [expandedSubject, setExpandedSubject] = useState(null);
    const [loadingTest, setLoadingTest] = useState(null);

    const syllabus = exam?.syllabus || {};
    const subjects = Object.keys(syllabus);

    const difficulties = [
        { level: 'Easy', count: 10, icon: '🟢' },
        { level: 'Medium', count: 15, icon: '🟡' },
        { level: 'Hard', count: 20, icon: '🔴' }
    ];

    const handleStartSectional = async (subject, difficulty) => {
        const testKey = `${subject}-${difficulty}`;
        setLoadingTest(testKey);

        try {
            console.log(`🎯 Generating sectional test: ${subject} (${difficulty})`);

            const test = await generateTest({
                examId,
                topic: subject,
                count: difficulties.find(d => d.level === difficulty)?.count || 15
            });

            if (test && test.testId) {
                navigate(`/quiz?testId=${test.testId}`);
            } else {
                alert('Failed to generate test. Please try again.');
            }
        } catch (err) {
            console.error('Error generating sectional test:', err);
            alert('Failed to generate test');
        } finally {
            setLoadingTest(null);
        }
    };

    if (!subjects.length) {
        return (
            <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar}`}>
                <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>📗 Sectional Practice</h2>
                <p className={theme.textMuted}>Syllabus sections not available for this exam.</p>
            </div>
        );
    }

    return (
        <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar}`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme.text}`}>
                📗 Sectional Practice
            </h2>

            <div className="space-y-4">
                {subjects.map((subject) => (
                    <div key={subject} className={`border ${theme.border} rounded-xl overflow-hidden`}>
                        {/* Subject Header */}
                        <button
                            onClick={() => setExpandedSubject(expandedSubject === subject ? null : subject)}
                            className={`w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors`}
                        >
                            <h3 className={`font-bold ${theme.text}`}>{subject}</h3>
                            <span className={`transform transition-transform ${expandedSubject === subject ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>

                        {/* Difficulty Levels */}
                        {expandedSubject === subject && (
                            <div className={`p-4 bg-white/5 border-t ${theme.border} space-y-3`}>
                                {difficulties.map((diff) => {
                                    const isLoading = loadingTest === `${subject}-${diff.level}`;

                                    return (
                                        <div
                                            key={diff.level}
                                            className={`flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors`}
                                        >
                                            <div>
                                                <span className="mr-2">{diff.icon}</span>
                                                <span className={`font-medium ${theme.text}`}>
                                                    {subject} – {diff.level}
                                                </span>
                                                <span className={`text-sm ${theme.textMuted} ml-2`}>
                                                    ({diff.count} Q)
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleStartSectional(subject, diff.level)}
                                                disabled={isLoading}
                                                className={`p-2 rounded-lg transition-all ${
                                                    isLoading
                                                        ? 'bg-gray-600 cursor-wait'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                            >
                                                {isLoading ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Play className="w-4 h-4 fill-current" />
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionalSection;
