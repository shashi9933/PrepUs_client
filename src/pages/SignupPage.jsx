import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, TrendingUp, Users, Award } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import logo from '../assets/branding-logo.png';

const SignupPage = () => {
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
        navigate('/'); // Redirect to home
    };

    return (
        <div className={`min-h-screen pt-20 flex ${theme.bg}`}>
            {/* Left Side - Marketing (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-blue-900 to-black relative overflow-hidden flex-col justify-center px-16 text-white border-r border-gray-800">
                <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute left-10 top-10 w-96 h-96 bg-cyan-500 rounded-full blur-[100px] opacity-30"></div>
                </div>

                <div className="relative z-10 space-y-10">
                    <div>
                        <img src={logo} alt="PrepUs" className="h-32 mb-6 object-contain" />
                        <h1 className="text-5xl font-bold leading-tight mb-4">
                            Start Your Journey <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                To Success
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Create an account to unlock the full potential of PrepUs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <TrendingUp className="w-8 h-8 text-cyan-400 mb-3" />
                            <h3 className="text-lg font-bold mb-1">Smart Analytics</h3>
                            <p className="text-gray-400 text-sm">Track your progress with AI-driven insights and detailed reports.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <Users className="w-8 h-8 text-purple-400 mb-3" />
                            <h3 className="text-lg font-bold mb-1">Active Community</h3>
                            <p className="text-gray-400 text-sm">Compete with thousands of students on the global leaderboard.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <Award className="w-8 h-8 text-yellow-400 mb-3" />
                            <h3 className="text-lg font-bold mb-1">Premium Content</h3>
                            <p className="text-gray-400 text-sm">Access high-quality questions curated by exam toppers.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className={`w-full lg:w-1/2 flex flex-col justify-center items-center px-4 md:px-12`}>
                <div className={`w-full max-w-md p-8 rounded-2xl ${theme.isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-xl border border-gray-100'}`}>

                    <div className="text-center mb-8">
                        <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>Create Account</h2>
                        <p className={theme.textMuted}>It's free and takes 1 minute</p>
                    </div>

                    {/* Google Login */}
                    <div className="mb-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Signup Failed')}
                            theme={theme.isDark ? 'filled_black' : 'outline'}
                            size="large"
                            text="signup_with"
                            width="100%"
                            shape="pill"
                        />
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700/50"></div></div>
                        <div className="relative flex justify-center text-sm"><span className={`px-2 ${theme.bg} ${theme.textMuted}`}>Or register with email</span></div>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Full Name</label>
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
                            <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Email Address</label>
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
                            <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Password</label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                                <input
                                    type="password"
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                    placeholder="Create password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="terms" className="rounded bg-white/10 border-gray-600 text-blue-500 focus:ring-blue-500 w-4 h-4" />
                            <label htmlFor="terms" className={`ml-2 text-sm ${theme.textMuted}`}>
                                I agree to the <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                            </label>
                        </div>

                        <button className="w-full py-3.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 mt-2">
                            Create Account
                        </button>
                    </form>

                    <div className={`mt-6 pt-6 border-t border-dashed border-gray-700/30 text-center text-sm ${theme.textMuted}`}>
                        Already have an account? <Link to="/login" className="text-blue-500 hover:underline font-semibold ml-1">Sign In</Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignupPage;
