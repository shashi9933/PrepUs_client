import React, { useState, useEffect } from 'react';
import { X, Clock, Target, Layers, Zap, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { fetchAllExams, fetchCategories } from '../services/api';

const FocusConfigModal = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Exams, 2: Duration, 3: Features
    const [config, setConfig] = useState({
        exams: [],
        duration: 25,
        features: []
    });

    const [examsList, setExamsList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                setLoading(true);
                try {
                    const cats = await fetchCategories();
                    setCategories(cats);
                    // Select first category by default if available
                    if (cats.length > 0) setSelectedCategory(cats[0].id);

                    const exams = await fetchAllExams();
                    setExamsList(exams);
                } catch (err) {
                    console.error("Failed to load details", err);
                }
                setLoading(false);
            };
            loadData();
        }
    }, [isOpen]);

    const filteredExams = selectedCategory
        ? examsList.filter(e => e.category === selectedCategory || e.category === 'all')
        : examsList;

    const durations = [25, 50, 60, 90];
    const [customDuration, setCustomDuration] = useState('');

    const featuresList = [
        { id: 'quiz', label: 'Quizzes', icon: Zap },
        { id: 'current_affairs', label: 'Current Affairs', icon: Layers },
        { id: 'news', label: 'News Feed', icon: Clock },
        { id: 'hot_questions', label: 'Hot Questions', icon: Target },
        { id: 'journals', label: 'Journals', icon: Layers }, // Using Layers as placeholder
        { id: 'practice', label: 'Practice Set', icon: Target }
    ];

    const toggleExam = (id) => {
        setConfig(prev => ({
            ...prev,
            exams: prev.exams.includes(id)
                ? prev.exams.filter(x => x !== id)
                : [...prev.exams, id]
        }));
    };

    const toggleFeature = (id) => {
        setConfig(prev => ({
            ...prev,
            features: prev.features.includes(id)
                ? prev.features.filter(x => x !== id)
                : [...prev.features, id]
        }));
    };

    const handleDurationSelect = (min) => {
        setConfig(prev => ({ ...prev, duration: min }));
        setCustomDuration('');
    };

    const handleCustomDuration = (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            setCustomDuration(val);
            setConfig(prev => ({ ...prev, duration: val }));
        }
    };

    const handleEnterFocus = () => {
        // Save to LocalStorage (or DB in future)
        localStorage.setItem('focusConfig', JSON.stringify(config));
        onClose();
        navigate('/focus');
        setStep(1); // Reset
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border ${theme.border} ${theme.sidebar} relative flex flex-col`}>

                {/* Header */}
                <div className={`p-6 border-b ${theme.border} flex justify-between items-center`}>
                    <div>
                        <h2 className={`text-2xl font-bold ${theme.text}`}>Focus Mode Configuration</h2>
                        <div className="flex space-x-2 mt-2">
                            <div className={`h-1 w-8 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                            <div className={`h-1 w-8 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                            <div className={`h-1 w-8 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                        </div>
                    </div>
                    <button onClick={onClose} className={`${theme.textMuted} hover:${theme.text}`}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">

                    {/* STEP 1: EXAMS */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className={`text-xl font-medium ${theme.text}`}>Select Your Goal</h3>

                            {/* Category Pills */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedCategory === cat.id
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : `bg-white/5 border-transparent hover:bg-white/10 ${theme.textMuted}`
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {loading ? (
                                    <div className={`col-span-2 text-center py-8 ${theme.textMuted}`}>Loading options...</div>
                                ) : filteredExams.length > 0 ? (
                                    filteredExams.map(exam => (
                                        <div
                                            key={exam.id}
                                            onClick={() => toggleExam(exam.id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${config.exams.includes(exam.id)
                                                ? 'bg-blue-600 border-blue-500 text-white'
                                                : `bg-white/5 border-transparent hover:bg-white/10 ${theme.text}`
                                                }`}
                                        >
                                            <div>
                                                <span className="font-semibold block">{exam.title}</span>
                                                <span className="text-xs opacity-70">{exam.subtitle}</span>
                                            </div>
                                            {config.exams.includes(exam.id) && <Check className="w-5 h-5 flex-shrink-0" />}
                                        </div>
                                    ))
                                ) : (
                                    <div className={`col-span-2 text-center py-8 ${theme.textMuted}`}>No exams found in this category.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DURATION */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className={`text-xl font-medium ${theme.text}`}>Select Session Duration (Minutes)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {durations.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => handleDurationSelect(d)}
                                        className={`py-4 rounded-xl border font-bold text-lg transition-all ${config.duration === d && customDuration === ''
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : `bg-white/5 border-transparent hover:bg-white/10 ${theme.text}`
                                            }`}
                                    >
                                        {d} min
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4">
                                <label className={`block text-sm font-medium mb-2 ${theme.textMuted}`}>Or Custom Duration</label>
                                <input
                                    type="number"
                                    value={customDuration}
                                    onChange={handleCustomDuration}
                                    placeholder="Enter minutes..."
                                    className={`w-full p-4 rounded-xl border ${theme.border} bg-white/5 ${theme.text} focus:outline-none focus:border-blue-500`}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: FEATURES */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className={`text-xl font-medium ${theme.text}`}>Select Functionalities</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {featuresList.map(feature => (
                                    <div
                                        key={feature.id}
                                        onClick={() => toggleFeature(feature.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-4 ${config.features.includes(feature.id)
                                            ? 'bg-purple-600 border-purple-500 text-white'
                                            : `bg-white/5 border-transparent hover:bg-white/10 ${theme.text}`
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${config.features.includes(feature.id) ? 'bg-white/20' : 'bg-black/20'}`}>
                                            <feature.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold">{feature.label}</span>
                                        <div className="flex-1 text-right">
                                            {config.features.includes(feature.id) && <Check className="w-5 h-5 ml-auto" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className={`p-6 border-t ${theme.border} flex justify-between`}>
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className={`px-6 py-2 rounded-lg font-medium hover:bg-white/10 ${theme.text}`}
                        >
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={step === 1 && config.exams.length === 0}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${(step === 1 && config.exams.length === 0)
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                }`}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleEnterFocus}
                            disabled={config.features.length === 0}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${config.features.length === 0
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-105 shadow-lg shadow-orange-500/20'
                                }`}
                        >
                            ENTER FOCUS ZONE ⚡
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default FocusConfigModal;
