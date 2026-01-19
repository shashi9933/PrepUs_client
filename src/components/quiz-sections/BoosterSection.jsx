import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Play, TrendingUp } from 'lucide-react';
import { fetchAnalytics, generateTest } from '../../services/api';

const BoosterSection = ({ examId, theme }) => {
    const navigate = useNavigate();
    const [weakAreas, setWeakAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTest, setLoadingTest] = useState(null);

    useEffect(() => {
        const loadWeakAreas = async () => {
            try {
                const analytics = await fetchAnalytics();
                
                // Extract weak areas from analytics
                const weakTopics = analytics?.weakAreas?.map(w => w.name) || [];
                setWeakAreas(weakTopics.slice(0, 5)); // Top 5 weak areas

                if (weakTopics.length === 0) {
                    console.log('✅ No weak areas detected - user performing well!');
                }
            } catch (err) {
                console.error('Failed to load analytics:', err);
                setWeakAreas([]);
            } finally {
                setLoading(false);
            }
        };

        loadWeakAreas();
    }, []);

    const handleStartBooster = async (topic) => {
        setLoadingTest(topic);

        try {
            console.log(`🚀 Generating booster test for:`, topic);

            const test = await generateTest({
                examId,
                topic,
                count: 10 // Booster = 10 quick questions
            });

            if (test && test.testId) {
                navigate(`/quiz?testId=${test.testId}`);
            }
        } catch (err) {
            console.error('Error generating booster test:', err);
            alert('Failed to generate booster test');
        } finally {
            setLoadingTest(null);
        }
    };

    if (loading) {
        return (
            <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar}`}>
                <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>🚀 Booster Tests</h2>
                <Loader className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    if (weakAreas.length === 0) {
        return (
            <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar} bg-green-500/10 border-green-500/20`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    🚀 Booster Tests
                </h2>
                <p className={`${theme.textMuted}`}>
                    🎉 Great job! You're performing well across all topics. No weak areas detected.
                </p>
            </div>
        );
    }

    return (
        <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar} bg-orange-500/5 border-orange-500/20`}>
            <h2 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${theme.text}`}>
                <TrendingUp className="w-6 h-6 text-orange-500" />
                🚀 Booster Tests (Recommended)
            </h2>
            <p className={`text-sm ${theme.textMuted} mb-6`}>
                Focus on your weak areas to improve faster
            </p>

            <div className="space-y-3">
                {weakAreas.map((topic) => {
                    const isLoading = loadingTest === topic;

                    return (
                        <div
                            key={topic}
                            className={`p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-between border ${theme.border}`}
                        >
                            <div>
                                <h3 className={`font-bold ${theme.text}`}>{topic} Booster</h3>
                                <p className={`text-sm ${theme.textMuted}`}>10 targeted questions</p>
                            </div>

                            <button
                                onClick={() => handleStartBooster(topic)}
                                disabled={isLoading}
                                className={`p-2 rounded-lg transition-all ${
                                    isLoading
                                        ? 'bg-gray-600 cursor-wait'
                                        : 'bg-orange-600 hover:bg-orange-700 text-white'
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
        </div>
    );
};

export default BoosterSection;
