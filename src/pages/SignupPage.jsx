import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, TrendingUp, Users, Award } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import logo from '../assets/branding-logo.png';
import { register, loginGoogle } from '../services/api';

const SignupPage = () => {
    const { theme } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await register(form);
            if (res.token) {
                login(res.user, res.token);
                navigate('/');
            } else {
                alert(res.error || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            alert("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const userData = {
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            provider: 'google',
            isProfileComplete: true
        };
        login(userData);
        navigate('/');
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
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className={`w-full lg:w-1/2 flex flex-col justify-center items-center px-4 md:px-12`}>
                <div className={`w-full max-w-md p-8 rounded-2xl ${theme.card} ${theme.border} border`}>

                    <div className="text-center mb-8">
                        <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>Create Account</h2>
                        <p className={theme.textMuted}>It's free and takes 1 minute</p>
                    </div>

                    {/* Google Login */}
                    <div className="mb-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Signup Failed')}
                            theme={theme.name === 'Light' ? 'outline' : 'filled_black'}
                            size="large"
                            text="signup_with"
                            width="100%"
                            shape="pill"
                        />
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className={`w-full border-t ${theme.border}`}></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className={`px-2 ${theme.name === 'Light' ? 'bg-white' : 'bg-slate-900'} ${theme.textMuted} rounded`}>Or register with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Full Name</label>
                            <div className="relative">
                                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.name === 'Light' ? 'bg-gray-50' : 'bg-white/5'}`}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Email Address</label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.name === 'Light' ? 'bg-gray-50' : 'bg-white/5'}`}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Password</label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.name === 'Light' ? 'bg-gray-50' : 'bg-white/5'}`}
                                    placeholder="Create password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="terms" required className="rounded bg-white/10 border-gray-600 text-blue-500 focus:ring-blue-500 w-4 h-4" />
                            <label htmlFor="terms" className={`ml-2 text-sm ${theme.textMuted}`}>
                                I agree to the <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                            </label>
                        </div>

                        <button className="w-full py-3.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 mt-2">
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className={`mt-6 pt-6 border-t ${theme.border} text-center text-sm ${theme.textMuted}`}>
                        Already have an account? <Link to="/login" className="text-blue-500 hover:underline font-semibold ml-1">Sign In</Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignupPage;
