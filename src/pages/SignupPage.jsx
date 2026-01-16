import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Shield, User, Mail, Lock, ArrowRight } from 'lucide-react';

const SignupPage = () => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen pt-20 flex flex-col justify-center items-center ${theme.bg}`}>
            <div className={`w-full max-w-md p-8 rounded-2xl border ${theme.border} ${theme.sidebar} ${theme.shadow}`}>

                <div className="text-center mb-8">
                    <Shield className={`w-12 h-12 mx-auto mb-4 ${theme.text}`} />
                    <h1 className={`text-2xl font-bold ${theme.text}`}>Create Account</h1>
                    <p className={theme.textMuted}>Join thousands of aspirants today</p>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Full Name</label>
                        <div className="relative">
                            <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                            <input
                                type="text"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Email Address</label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                            <input
                                type="email"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Password</label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                            <input
                                type="password"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                placeholder="Create a strong password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input type="checkbox" id="terms" className="rounded bg-white/10 border-gray-600 text-blue-500 focus:ring-blue-500" />
                        <label htmlFor="terms" className={`ml-2 text-sm ${theme.textMuted}`}>
                            I agree to the <a href="#" className="text-blue-500 hover:underline">Terms</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                        </label>
                    </div>

                    <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 mt-2">
                        Create Account
                    </button>
                </form>

                <div className={`mt-6 pt-6 border-t border-dashed border-gray-700/30 text-center text-sm ${theme.textMuted}`}>
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline font-semibold">Sign In</Link>
                </div>

            </div>
        </div>
    );
};

export default SignupPage;
