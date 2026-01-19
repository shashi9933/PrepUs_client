import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, RotateCcw, Zap, Target, Layers, Clock, BookOpen, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FocusModePage = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [config, setConfig] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [activeTab, setActiveTab] = useState(null); // Initialize as null for safety

    // Prevent accidental navigation
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isActive) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isActive]);

    // Load Config Safely
    useEffect(() => {
        const savedConfig = localStorage.getItem('focusConfig');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                if (!parsed.duration || !parsed.features) throw new Error("Invalid config");

                setConfig(parsed);
                setTimeLeft(parsed.duration * 60);
                setIsActive(false); // Fix: Do not auto-start

                if (parsed.features && parsed.features.length > 0) {
                    setActiveTab(parsed.features[0]);
                }
            } catch (err) {
                console.error("Config load error", err);
                localStorage.removeItem('focusConfig');
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    // Robust Timer Logic
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsActive(false);
                    // Timer Completion Logic
                    toast.success('Focus session completed! Great job!');
                    // Here you would typically save the session to the backend
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

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
        if (isActive && timeLeft > 0) {
            if (window.confirm("Are you sure you want to exit? Your focus session progress will be lost.")) {
                navigate('/');
            }
        } else {
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
                        <div className={`mt-8 p-6 border border-dashed ${theme.border} rounded-xl w-full max-w-lg`}>
                            <p className={theme.textMuted}>Quiz Component Placeholder</p>
                        </div>
                    </div>
                );
            case 'news': // Using 'news' ID from featureIcons map below (assuming standard is 'news')
            case 'current_affairs': // Handle potential ID mismatch
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`p-6 rounded-xl border ${theme.border} ${theme.card}`}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-blue-500 uppercase">Current Affairs</span>
                                    <span className={`text-xs ${theme.textMuted}`}>2 mins ago</span>
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${theme.text}`}>Major Policy Update</h3>
                                <p className={`text-sm ${theme.textMuted} line-clamp-3`}>
                                    Latest updates relevant to your exam preparation...
                                </p>
                            </div>
                        ))}
                    </div>
                );
            case 'hot_questions':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                        <Target className="w-16 h-16 mb-4 text-red-400" />
                        <h2 className={`text-xl font-bold ${theme.text}`}>Hot Questions</h2>
                        <p className={theme.textMuted}>High-probability questions for {config.exams[0]}</p>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                        <Layers className={`w-16 h-16 mb-4 ${theme.textMuted}`} />
                        <h2 className={`text-xl font-bold ${theme.textMuted}`}>Select a feature from the sidebar</h2>
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
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        <span className={`font-bold text-lg tracking-wider ${theme.text}`}>FOCUS MODE</span>
                    </div>
                    {/* Focus Goal Display */}
                    <div className={`hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border ${theme.border}`}>
                        <Target className="w-3 h-3 text-blue-400" />
                        <span className={`text-xs ${theme.textMuted}`}>Goal: {config.duration} min • {config.exams.join(', ')}</span>
                    </div>
                </div>

                {/* Timer Display */}
                <div className="flex items-center space-x-6">
                    <div className={`font-mono text-3xl font-bold transition-colors duration-300 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : theme.text}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={toggleTimer}
                            className={`p-2 rounded-full hover:bg-white/10 ${theme.text} transition-colors`}
                            title={isActive ? "Pause" : "Start"}
                        >
                            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={resetTimer}
                            className={`p-2 rounded-full hover:bg-white/10 ${theme.text} transition-colors`}
                            title="Reset Timer"
                        >
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
                            // Check for both ID variations just in case
                            let Icon = featureIcons[fId] || Layers;
                            // Alias check for news/current_affairs
                            if (fId === 'current_affairs' && !featureIcons[fId]) Icon = featureIcons['news'];

                            return (
                                <button
                                    key={fId}
                                    onClick={() => setActiveTab(fId)}
                                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === fId
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : `hover:bg-white/5 ${theme.textMuted} hover:text-white`
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
                        {/* Subtle texture if needed */}
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
