import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, RotateCcw, Zap, Target, Layers, Clock, BookOpen } from 'lucide-react';

const FocusModePage = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [config, setConfig] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [activeTab, setActiveTab] = useState(''); // Current feature view

    useEffect(() => {
        const savedConfig = localStorage.getItem('focusConfig');
        if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            setConfig(parsed);
            setTimeLeft(parsed.duration * 60);
            setIsActive(true);
            if (parsed.features.length > 0) setActiveTab(parsed.features[0]);
        } else {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        if (config) {
            setTimeLeft(config.duration * 60);
            setIsActive(false);
        }
    };

    const handleExit = () => {
        if (window.confirm("Are you sure you want to leave Focus Mode? progress might be lost.")) {
            navigate('/');
        }
    };

    if (!config) return null;

    const renderFeatureContent = () => {
        switch (activeTab) {
            case 'quiz':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Zap className="w-16 h-16 text-yellow-400 mb-4" />
                        <h2 className={`text-2xl font-bold ${theme.text}`}>Quick Quiz Mode</h2>
                        <p className={theme.textMuted}>Fetching specialized questions for {config.exams.join(', ')}...</p>
                        {/* Placeholder for Quiz Component */}
                        <div className="mt-8 p-6 border border-dashed border-gray-600 rounded-xl">
                            Quiz Content Would Load Here
                        </div>
                    </div>
                );
            case 'news':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`p-6 rounded-xl border ${theme.border} ${theme.card}`}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-blue-500 uppercase">Current Affairs</span>
                                    <span className={`text-xs ${theme.textMuted}`}>2 mins ago</span>
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${theme.text}`}>Major Economic Policy Shift Announced by RBI</h3>
                                <p className={`text-sm ${theme.textMuted} line-clamp-3`}>
                                    The Reserve Bank of India has today announced a significant change in the repo rate structure aimed at controlling inflation while sustaining growth...
                                </p>
                            </div>
                        ))}
                    </div>
                );
            // ... Add other cases as needed
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                        <Layers className="w-16 h-16 mb-4" />
                        <h2 className="text-xl font-bold">Select a feature from the sidebar</h2>
                    </div>
                );
        }
    };

    const featureIcons = {
        quiz: Zap,
        current_affairs: Layers,
        news: Clock,
        hot_questions: Target,
        journals: BookOpen,
        practice: Target
    };

    return (
        <div className={`min-h-screen ${theme.bg} flex flex-col`}>

            {/* Top Bar - Distraction Free */}
            <div className={`h-16 border-b ${theme.border} ${theme.sidebar} flex items-center justify-between px-6 z-50`}>
                <div className="flex items-center space-x-2">
                    <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className={`font-bold text-lg tracking-wider ${theme.text}`}>FOCUS MODE</span>
                </div>

                {/* Timer Display */}
                <div className="flex items-center space-x-6">
                    <div className={`font-mono text-3xl font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : theme.text}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={toggleTimer} className={`p-2 rounded-full hover:bg-white/10 ${theme.text}`}>
                            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <button onClick={resetTimer} className={`p-2 rounded-full hover:bg-white/10 ${theme.text}`}>
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleExit}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                    <span className="font-medium">Exit</span>
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <div className={`w-20 md:w-64 border-r ${theme.border} ${theme.sidebar} flex flex-col py-6`}>
                    <div className="space-y-2 px-3">
                        {config.features.map(fId => {
                            const Icon = featureIcons[fId] || Layers;
                            return (
                                <button
                                    key={fId}
                                    onClick={() => setActiveTab(fId)}
                                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === fId
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : `hover:bg-white/5 ${theme.textMuted} hover:${theme.text}`
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="hidden md:inline font-medium capitalize">{fId.replace('_', ' ')}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-auto px-6">
                        <div className={`p-4 rounded-xl bg-white/5 border ${theme.border}`}>
                            <p className={`text-xs ${theme.textMuted} mb-2`}>Target Exams</p>
                            <div className="flex flex-wrap gap-2">
                                {config.exams.map(e => (
                                    <span key={e} className="text-xs px-2 py-1 rounded bg-black/40 text-blue-400 uppercase font-bold">
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-5">
                        {/* Optional grid pattern or texture */}
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {renderFeatureContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusModePage;
