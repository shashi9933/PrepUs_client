import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/api';
import { User, Target, ArrowRight } from 'lucide-react';

const OnboardingPage = () => {
    const { user, login } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [exam, setExam] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateProfile({ userId: user.id, name, targetExam: exam });
            if (res.user) {
                // Update local user state
                login(res.user, localStorage.getItem('token'));
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen pt-20 flex justify-center items-center ${theme.bg} px-4`}>
            <div className={`w-full max-w-md p-8 rounded-2xl ${theme.card} ${theme.border} border`}>
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>One Last Step!</h2>
                    <p className={theme.textMuted}>Tell us a bit about yourself to personalize your experience.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>What should we call you?</label>
                        <div className="relative">
                            <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.name === 'Light' ? 'bg-gray-50' : 'bg-white/5'}`}
                                placeholder="Your Name"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Which Exam are you targeting?</label>
                        <div className="relative">
                            <Target className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                            <select
                                value={exam}
                                onChange={(e) => setExam(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.name === 'Light' ? 'bg-gray-50' : 'bg-white/5'}`}
                                required
                            >
                                <option value="" disabled>Select an Exam</option>
                                <option value="sbi-po">SBI PO</option>
                                <option value="sbi-clerk">SBI Clerk</option>
                                <option value="ibps-po">IBPS PO</option>
                                <option value="rbi-grade-b">RBI Grade B</option>
                                <option value="ssc-cgl">SSC CGL</option>
                                <option value="upsc-cse">UPSC CSE</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center group disabled:opacity-70"
                    >
                        {loading ? 'Setting up...' : 'Get Started'}
                        {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;
