import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Timer, AlertTriangle, Loader, CheckCircle } from 'lucide-react';
import VideoLoader from '../components/VideoLoader';
import { fetchDailyTest, submitTestAttempt } from '../services/api';

const QuizInterfacePage = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [testData, setTestData] = useState(null); // Full test object
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState({}); // { qId: { option: idx, time: ms } }

    // Timer State
    const [startTime, setStartTime] = useState(Date.now());
    const [timeSpentOnCurrent, setTimeSpentOnCurrent] = useState(0);
    const [totalTestTime, setTotalTestTime] = useState(0); // Only active time

    const [submitting, setSubmitting] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    // Initial Fetch
    useEffect(() => {
        if (!user) return navigate('/login');

        const examId = searchParams.get('exam');
        if (!examId) return;

        const loadTest = async () => {
            const data = await fetchDailyTest(examId);
            if (data) {
                setTestData(data);
                setQuestions(data.questions || []);
                setStartTime(Date.now()); // Start timer for Q1
            }
            setLoading(false);
        };
        loadTest();
    }, [user, navigate, searchParams]);

    // Timer Logic for Current Question
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpentOnCurrent(Date.now() - startTime);
        }, 100);
        return () => clearInterval(timer);
    }, [startTime]);

    const handleAnswer = (optionIndex) => {
        // Just select, don't submit yet
        const qId = questions[currentQuestion]._id;
        setResponses(prev => ({
            ...prev,
            [qId]: { ...prev[qId], selectedOption: optionIndex }
        }));
    };

    const handleNext = () => {
        // 1. Record Time for current question
        const qId = questions[currentQuestion]._id;
        const timeForThisQ = (Date.now() - startTime) / 1000; // seconds

        setResponses(prev => ({
            ...prev,
            [qId]: {
                selectedOption: prev[qId]?.selectedOption ?? -1,
                timeTaken: (prev[qId]?.timeTaken || 0) + timeForThisQ
            }
        }));

        setTotalTestTime(prev => prev + timeForThisQ);

        // 2. Move to next
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(curr => curr + 1);
            setStartTime(Date.now()); // Reset start time for next Q
            setTimeSpentOnCurrent(0);
        } else {
            // Finish
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        setSubmitting(true);

        // Finalize last question time if not already done (handleNext does it usually, but if 'Finish' button calls this directly)
        // Note: handleNext calls this, so time is recorded. 
        // But we need to construct the payload array

        // Wait a tick for state update if needed, or construct from local vars
        // Actually, handleNext updates state. React batching might be tricky.
        // Safer to construct payload from 'responses' + current Q update

        const qId = questions[currentQuestion]._id;
        const timeForLastQ = (Date.now() - startTime) / 1000;

        const finalResponses = { ...responses };
        finalResponses[qId] = {
            selectedOption: finalResponses[qId]?.selectedOption ?? -1,
            timeTaken: (finalResponses[qId]?.timeTaken || 0) + timeForLastQ
        };

        const payload = {
            userId: user.id || 'guest', // In real app, user.id from auth
            testId: testData._id,
            examId: testData.examId,
            totalTimeTaken: totalTestTime + timeForLastQ,
            responses: Object.keys(finalResponses).map(qid => ({
                questionId: qid,
                selectedOption: finalResponses[qid].selectedOption,
                timeTaken: finalResponses[qid].timeTaken
            }))
        };

        const result = await submitTestAttempt(payload);
        setAnalysis(result?.analysis);
        setSubmitting(false);
    };

    if (loading) return <VideoLoader />;

    // --- Analysis View (Simple Success State for now) ---
    if (analysis) {
        return (
            <div className={`min-h-screen pt-24 ${theme.bg} text-white pb-20`}>
                <div className="max-w-4xl mx-auto px-4">
                    {/* Summary Card */}
                    <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-lg mb-8">
                        <div className="text-center mb-8">
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold">Analysis Ready</h2>
                            <p className="opacity-70 mt-2">Here is how you performed in {testData?.title}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-sm opacity-60">Score</div>
                                <div className="text-2xl font-bold text-blue-400">{analysis.summary.score}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-sm opacity-60">Accuracy</div>
                                <div className="text-2xl font-bold text-green-400">{analysis.summary.accuracy}%</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-sm opacity-60">Time</div>
                                <div className="text-2xl font-bold text-yellow-400">{Math.round(analysis.summary.totalTime)}s</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-sm opacity-60">Mistakes</div>
                                <div className="text-2xl font-bold text-red-400">{analysis.mistakes.length}</div>
                            </div>
                        </div>

                        {analysis.recommendations?.action && (
                            <div className="p-4 border border-blue-500/30 bg-blue-500/10 rounded-xl mb-8 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-blue-300">AI Recommendation</h4>
                                    <p className="text-sm opacity-80">{analysis.recommendations.action}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button onClick={() => navigate('/')} className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200">
                                Back to Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Detailed Question Review */}
                    <h3 className="text-2xl font-bold mb-6">Detailed Review</h3>
                    <div className="space-y-6">
                        {questions.map((q, idx) => {
                            const userAnswer = responses[q._id]?.selectedOption ?? -1;
                            const isCorrect = userAnswer === q.correctIndex;
                            const isSkipped = userAnswer === -1;

                            return (
                                <div key={q._id} className={`p-6 rounded-xl border ${isCorrect ? 'border-green-500/30 bg-green-500/5' : isSkipped ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-lg font-medium flex-1">
                                            <span className="opacity-50 mr-2">{idx + 1}.</span>
                                            {q.questionText}
                                        </h4>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-green-500/20 text-green-400' : isSkipped ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Wrong'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {q.options.map((opt, optIdx) => {
                                            const isSelected = userAnswer === optIdx;
                                            const isTheCorrectAnswer = q.correctIndex === optIdx;

                                            let style = "border-white/10 opacity-50";
                                            if (isTheCorrectAnswer) style = "border-green-500 bg-green-500/20 text-green-400 opacity-100";
                                            if (isSelected && !isTheCorrectAnswer) style = "border-red-500 bg-red-500/20 text-red-400 opacity-100";

                                            return (
                                                <div key={optIdx} className={`p-3 rounded-lg border ${style} text-sm flex justify-between`}>
                                                    <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                                    {isTheCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-400" />}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="bg-black/20 p-4 rounded-lg text-sm">
                                        <span className="font-bold text-blue-400">Explanation:</span> <span className="opacity-80">{q.explanation}</span>
                                        <div className="mt-2 text-xs opacity-40">Source: {q.source} • Topic: {q.topic}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (!questions.length) return <div className="text-center pt-24 text-white">No questions found for this exam.</div>;

    const question = questions[currentQuestion];
    const qId = question._id;
    const currentAns = responses[qId]?.selectedOption;

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 text-white">
                    <h2 className="text-xl font-bold opacity-90">Question {currentQuestion + 1} <span className="opacity-50">/ {questions.length}</span></h2>
                    <div className="flex items-center space-x-2 text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                        <Timer className="w-5 h-5" />
                        <span className="font-mono font-bold">{(timeSpentOnCurrent / 1000).toFixed(1)}s</span>
                    </div>
                </div>

                {/* Question Card */}
                <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar} min-h-[400px] flex flex-col relative overflow-hidden`}>
                    <h3 className={`text-2xl font-medium mb-8 ${theme.text} leading-relaxed`}>
                        {question.questionText}
                    </h3>

                    <div className="space-y-4 flex-1">
                        {question.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border transition-all group ${currentAns === idx
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                                    : `bg-white/5 border-white/10 ${theme.text} hover:bg-white/10 hover:border-white/20`
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold transition-colors ${currentAns === idx
                                        ? 'bg-white/20 border-transparent text-white'
                                        : 'bg-black/20 border-white/10 opacity-50 text-white group-hover:opacity-100'
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-lg">{opt}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-between items-center pt-8 border-t border-white/5">
                        <div className="text-sm opacity-40 text-white">
                            Topic: {question.topic} • Difficulty: {question.difficulty}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={submitting}
                            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${submitting
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {submitting ? (
                                <>Processing <Loader className="w-4 h-4 animate-spin" /></>
                            ) : (
                                currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizInterfacePage;
