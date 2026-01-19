import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Timer, AlertTriangle, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import VideoLoader from '../components/VideoLoader';
import { submitTestAttempt, fetchTestById } from '../services/api';

const QuizInterfacePage = () => {
    const { theme } = useTheme();
    const { user, loading: loadingAuth } = useAuth();
    const { testId: paramTestId } = useParams();
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
    const [error, setError] = useState(null);

    // Initial Fetch
    useEffect(() => {
        if (loadingAuth) return; // Wait for Auth check
        if (!user) return navigate('/login');

        // STRICT MODE: Test ID is mandatory
        if (!paramTestId) {
            navigate('/quizzes'); // Redirect if no test ID
            return;
        }

        const loadTest = async () => {
            // ... (rest of logic)
            try {
                setLoading(true);
                console.log('🎓 Loading test with ID:', paramTestId);
                // 1. Fetch Request (Secure Client handles Auth)
                const data = await fetchTestById(paramTestId);
                console.log('✅ Test data received:', data);

                // 2. Strict Validation
                if (!data) {
                    console.error('❌ Test data is null/undefined');
                    throw new Error('Test not found (404)');
                }

                // 3. Data Integrity Check
                console.log('📊 Test structure:', { hasQuestions: !!data.questions, count: data.questions?.length });
                if (!data.questions || data.questions.length === 0) {
                    console.error('❌ Test has no questions:', data);
                    throw new Error('Test is empty (No questions linked)');
                }

                // 4. Normalize Data Structure (Robust against Schema V1 vs V2)
                const normalizedQuestions = data.questions.map(q => {
                    if (q.questionId && typeof q.questionId === 'object') {
                        // V2: Nested Reference { questionId: Obj, order: 1 }
                        return { ...q.questionId, _order: q.order };
                    }
                    if (q._id) {
                        // V1: Direct Reference (legacy) or Flattened
                        return q;
                    }
                    console.warn("Invalid Question Format:", q);
                    return null;
                }).filter(Boolean); // Remove nulls

                if (normalizedQuestions.length === 0) {
                    throw new Error('Test contains invalid question references');
                }

                setTestData(data);
                setQuestions(normalizedQuestions);
                setStartTime(Date.now());
            } catch (err) {
                console.error("Test Load Error:", err);
                setError(err.message || "Failed to load test");
            } finally {
                setLoading(false);
            }
        };
        loadTest();
    }, [user, navigate, paramTestId]);

    // Timer Logic for Current Question
    useEffect(() => {
        if (!loading && !analysis) {
            const timer = setInterval(() => {
                setTimeSpentOnCurrent(Date.now() - startTime);
            }, 100);
            return () => clearInterval(timer);
        }
    }, [startTime, loading, analysis]);

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

        const qId = questions[currentQuestion]._id;
        const timeForLastQ = (Date.now() - startTime) / 1000;

        const finalResponses = { ...responses };
        finalResponses[qId] = {
            selectedOption: finalResponses[qId]?.selectedOption ?? -1,
            timeTaken: (finalResponses[qId]?.timeTaken || 0) + timeForLastQ
        };

        const payload = {
            userId: user.id || 'guest',
            testId: testData._id,
            examId: testData.examId,
            totalTimeTaken: totalTestTime + timeForLastQ,
            responses: Object.keys(finalResponses).map(qid => ({
                questionId: qid,
                selectedOption: finalResponses[qid].selectedOption,
                timeTaken: finalResponses[qid].timeTaken
            }))
        };

        try {
            const result = await submitTestAttempt(payload);
            setAnalysis(result?.analysis);
        } catch (err) {
            console.error("Submission failed", err);
            alert("Failed to submit test. Please check your connection.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <VideoLoader />;

    // Hard Error State
    if (error) {
        return (
            <div className={`min-h-screen pt-24 ${theme.bg} text-white flex flex-col items-center justify-center`}>
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                    onClick={() => navigate('/quizzes')}
                    className="px-6 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                    Back to Quizzes
                </button>
            </div>
        );
    }

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
                            <button onClick={() => navigate('/analytics')} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
                                View Full Analytics
                            </button>
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
