import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Smartphone } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import logo from '../assets/branding-logo.png';
import { sendOtp, verifyOtp, loginEmail, loginGoogle } from '../services/api';

const LoginPage = () => {
    const { theme } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('phone'); // 'phone' | 'email'
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP (Only for Phone tab)

    // Form States
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Phone Logic ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (phone.length < 10) return alert("Please enter valid phone number");

        setLoading(true);
        try {
            await sendOtp(phone);
            setStep(2);
        } catch (error) {
            console.error(error);
            alert("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await verifyOtp(phone, otp);
            if (res.token) {
                handleLoginSuccess(res.user, res.token);
            } else {
                alert(res.error || "Verification failed");
            }
        } catch (error) {
            console.error(error);
            alert("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // --- Email Logic ---
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginEmail({ email, password });
            if (res.token) {
                handleLoginSuccess(res.user, res.token);
            } else {
                alert(res.error || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    // --- Common ---
    const handleLoginSuccess = (user, token) => {
        login(user, token);
        if (!user.isProfileComplete) {
            navigate('/onboarding');
        } else {
            navigate('/');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            // Send token to backend to get real User ID and Session
            const res = await loginGoogle(credentialResponse.credential);
            handleLoginSuccess(res.user, res.token);
        } catch (error) {
            console.error('Google Login Error', error);
            alert('Google Login Failed');
        } finally {
            setLoading(false);
        }
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
                        <img src={logo} alt="PrepUs" className="h-32 mb-6 object-contain" />
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
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className={`w-full lg:w-1/2 flex flex-col justify-center items-center px-4 md:px-12`}>
                <div className={`w-full max-w-md p-8 rounded-2xl ${theme.card} ${theme.border} border`}>

                    <div className="text-center mb-8">
                        <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>Welcome Back</h2>
                        <p className={theme.textMuted}>Login to continue your preparation</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex mb-6 border-b border-gray-700">
                        <button
                            className={`flex-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'phone' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab('phone')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Smartphone className="w-4 h-4" /> Phone
                            </div>
                        </button>
                        <button
                            className={`flex-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'email' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab('email')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" /> Email
                            </div>
                        </button>
                    </div>

                    {activeTab === 'phone' ? (
                        step === 1 ? (
                            <form onSubmit={handleSendOtp} className="space-y-5">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Phone Number</label>
                                    <div className="relative">
                                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500`}>+91</div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.name === 'Light' ? 'bg-gray-50' : 'bg-white/5'}`}
                                            placeholder="9876543210"
                                            maxLength="10"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <button className="w-full py-3.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center group">
                                    {loading ? 'Sending OTP...' : 'Get OTP'}
                                    {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-5">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Enter OTP</label>
                                    <div className="relative">
                                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.name === 'Light' ? 'bg-gray-50' : 'bg-white/5'} tracking-[0.5em] text-center text-lg font-bold`}
                                            placeholder="••••"
                                            maxLength="4"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="mt-2 text-right">
                                        <button type="button" onClick={() => setStep(1)} className="text-xs text-blue-500 hover:underline">Change Number</button>
                                    </div>
                                </div>
                                <button className="w-full py-3.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center group">
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </button>
                            </form>
                        )
                    ) : (
                        // Email Login Form
                        <form onSubmit={handleEmailLogin} className="space-y-5">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${theme.text}`}>Email Address</label>
                                <div className="relative">
                                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.name === 'Light' ? 'bg-gray-50' : 'bg-white/5'}`}
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                            </div>
                            <button className="w-full py-3.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center group">
                                {loading ? 'Logging In...' : 'Login'}
                                {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    )}

                    <div className="relative my-8">
                        <div className={`absolute inset-0 flex items-center`}><div className={`w-full border-t ${theme.border}`}></div></div>
                        <div className="relative flex justify-center text-sm"><span className={`px-2 ${theme.name === 'Light' ? 'bg-white' : 'bg-slate-900'} ${theme.textMuted} rounded`}>Or continue with</span></div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Login Failed')}
                            theme={theme.name === 'Light' ? 'outline' : 'filled_black'}
                            size="large"
                            shape="pill"
                        />
                    </div>

                    <div className={`mt-6 pt-6 border-t ${theme.border} text-center text-sm ${theme.textMuted}`}>
                        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline font-semibold ml-1">Sign Up</Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
