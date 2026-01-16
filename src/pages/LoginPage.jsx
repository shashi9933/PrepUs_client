import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
    const { theme } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const userData = {
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            provider: 'google'
        };
        login(userData);
        navigate('/'); // Redirect to home or previous page
    };

    return (
        <div className={`min-h-screen pt-20 flex ${theme.bg}`}>
            {/* Left Side - Marketing (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden flex-col justify-center px-16 text-white border-r border-gray-800">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute left-0 bottom-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative z-10 space-y-8">
                    <div>
                        <Shield className="w-16 h-16 text-blue-500 mb-6" />
                        <h1 className="text-5xl font-bold leading-tight mb-4">
                            Master Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Exam Preparation
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Join 50,000+ aspirants cracking Banking, SSC, and UPSC exams with PrepUs.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Unlimited Free Mock Tests",
                            "Detailed Performance Analytics",
                            "Daily Current Affairs Updates",
                            "Expert-Curated Study Plans"
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-3 text-lg font-medium text-gray-300">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 flex items-center space-x-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-black bg-gray-700 flex items-center justify-center text-xs overflow-hidden`}>
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <span className="text-gray-400">Trusted by top rankers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className={`w-full lg:w-1/2 flex flex-col justify-center items-center px-4 md:px-12`}>
                <div className={`w-full max-w-md p-8 rounded-2xl ${theme.isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-xl border border-gray-100'}`}>

                    <div className="text-center mb-8">
                        <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>Welcome Back</h2>
                        <p className={theme.textMuted}>Sign in to your account</p>
                    </div>

                    {/* Google Login */}
                    <div className="mb-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Login Failed')}
                            theme={theme.isDark ? 'filled_black' : 'outline'}
                            size="large"
                            shape="pill"
                        />
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700/50"></div></div>
                        <div className="relative flex justify-center text-sm"><span className={`px-2 ${theme.bg} ${theme.textMuted}`}>Or continue with email</span></div>
                    </div>

                    <form className="space-y-5">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Email</label>
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
                            <div className="flex justify-between items-center mb-1.5">
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

                        <button className="w-full py-3.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center group">
                            Sign In
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className={`mt-8 pt-6 border-t border-dashed border-gray-700/30 text-center text-sm ${theme.textMuted}`}>
                        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline font-semibold ml-1">Create free account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
