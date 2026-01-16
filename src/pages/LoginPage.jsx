import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen pt-20 flex flex-col justify-center items-center ${theme.bg}`}>
            <div className={`w-full max-w-md p-8 rounded-2xl border ${theme.border} ${theme.sidebar} ${theme.shadow}`}>

                <div className="text-center mb-8">
                    <Shield className={`w-12 h-12 mx-auto mb-4 ${theme.text}`} />
                    <h1 className={`text-2xl font-bold ${theme.text}`}>Welcome Back</h1>
                    <p className={theme.textMuted}>Sign in to continue your preparation</p>
                </div>

                <form className="space-y-6">
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
                        <div className="flex justify-between items-center mb-2">
                            <label className={`block text-sm font-medium ${theme.text}`}>Password</label>
                            <a href="#" className="text-xs text-blue-500 hover:underline">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                            <input
                                type="password"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        Sign In
                    </button>
                </form>

                <div className={`mt-6 pt-6 border-t border-dashed border-gray-700/30 text-center text-sm ${theme.textMuted}`}>
                    Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline font-semibold">Sign up</Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
