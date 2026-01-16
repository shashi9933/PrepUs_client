import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Loader2, Timer, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const QuizInterfacePage = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({}); // { qId: optionId }
    const [showResult, setShowResult] = useState(false);

    // Check Auth
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Mock Fetch Questions based on Exams
    useEffect(() => {
        const fetchQuestions = async () => {
            // In real app, fetch from /api/questions?exams=...
            // For now, simulating API delay and dummy data
            await new Promise(r => setTimeout(r, 1000));

            setQuestions([
                { id: 1, text: "Which is the largest public sector bank in India?", options: ["SBI", "PNB", "BoB", "Canara"], correct: 0 },
                { id: 2, text: "RBI was established in which year?", options: ["1935", "1947", "1950", "1969"], correct: 0 },
                { id: 3, text: "Who consists of the Cabinet Mission?", options: ["Pethick Lawrence", "Stafford Cripps", "A.V. Alexander", "All of above"], correct: 3 },
                { id: 4, text: "The headquarters of ISRO is located in?", options: ["Mumbai", "Bengaluru", "Chennai", "Delhi"], correct: 1 },
            ]);
            setLoading(false);
        };
        fetchQuestions();
    }, [searchParams]);

    const handleAnswer = (optionIndex) => {
        setAnswers(prev => ({ ...prev, [currentQuestion]: optionIndex }));
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(curr => curr + 1);
        } else {
            setShowResult(true);
        }
    };

    if (loading) return (
        <div className={`min-h-screen pt-24 ${theme.bg} flex justify-center`}>
            <Loader2 className={`w-12 h-12 animate-spin ${theme.text}`} />
        </div>
    );

    if (showResult) {
        const score = questions.reduce((acc, q, idx) => {
            return acc + (answers[idx] === q.correct ? 1 : 0);
        }, 0);

        return (
            <div className={`min-h-screen pt-24 ${theme.bg}`}>
                <div className="max-w-2xl mx-auto p-8 rounded-2xl border bg-white/5 border-gray-700 text-center">
                    <h2 className={`text-3xl font-bold mb-6 ${theme.text}`}>Quiz Completed!</h2>
                    <div className="text-6xl font-black text-blue-500 mb-4">{score} / {questions.length}</div>
                    <p className={`${theme.textMuted} mb-8`}>Great job {user?.name}! You have completed the selected module.</p>
                    <button onClick={() => navigate('/')} className="px-8 py-3 bg-blue-600 rounded-full text-white font-bold hover:bg-blue-700">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-4xl mx-auto px-4">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className={`text-xl font-bold ${theme.text}`}>Question {currentQuestion + 1}/{questions.length}</h2>
                    <div className="flex items-center space-x-2 text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-full">
                        <Timer className="w-5 h-5" />
                        <span className="font-mono font-bold">10:00</span>
                    </div>
                </div>

                {/* Question Card */}
                <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar} min-h-[400px] flex flex-col`}>
                    <h3 className={`text-2xl font-medium mb-8 ${theme.text}`}>{question.text}</h3>

                    <div className="space-y-4 flex-1">
                        {question.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${answers[currentQuestion] === idx
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                                        : `bg-white/5 border-white/10 ${theme.text} hover:bg-white/10`
                                    }`}
                            >
                                <span className="inline-block w-8 font-bold opacity-50">{String.fromCharCode(65 + idx)}.</span>
                                {opt}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={nextQuestion}
                            className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QuizInterfacePage;
