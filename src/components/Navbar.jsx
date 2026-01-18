import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, ChevronDown, Shield, Palette } from 'lucide-react';
import logo from '../assets/branding-logo.png';

const Navbar = () => {
    const { theme, currentTheme, setCurrentTheme, themes } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Quizzes', path: '/quizzes' },
        { name: 'Exams', path: '/exams' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'Analytics', path: '/analytics' }
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${theme.sidebar} border-b ${theme.border}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="PrepUs Logo" className="h-[5.5rem] w-auto object-contain -my-4" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${item.name === 'Home' ? theme.text : theme.textMuted
                                        } hover:${theme.text}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsThemeOpen(!isThemeOpen)}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${theme.textMuted} hover:${theme.text} transition-colors`}
                            >
                                <Palette className="w-4 h-4 mr-2" />
                                <span>Theme</span>
                                <ChevronDown className="w-4 h-4 ml-1" />
                            </button>

                            {isThemeOpen && (
                                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${theme.card} border ${theme.border} z-50`}>
                                    {Object.keys(themes).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setCurrentTheme(key);
                                                setIsThemeOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${currentTheme === key ? theme.accent + ' text-white' : theme.text
                                                } hover:opacity-80`}
                                        >
                                            {themes[key].name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/login" className={`${theme.accent} ${theme.accentHover} text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg`}>
                            Login/Signup
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-md ${theme.textMuted} hover:${theme.text}`}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={`md:hidden ${theme.sidebar} border-b ${theme.border}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${theme.text} hover:opacity-80`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="px-3 py-2">
                            <Link to="/login" className={`block w-full text-center ${theme.accent} ${theme.accentHover} text-white px-4 py-2 rounded-full text-sm font-medium mb-4`}>
                                Login/Signup
                            </Link>

                            <p className={`text-xs uppercase font-bold mb-2 ${theme.textMuted}`}>Select Theme</p>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.keys(themes).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setCurrentTheme(key)}
                                        className={`px-3 py-2 rounded-md text-sm text-center ${currentTheme === key ? theme.accent + ' text-white' : theme.card + ' ' + theme.text
                                            }`}
                                    >
                                        {themes[key].name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
