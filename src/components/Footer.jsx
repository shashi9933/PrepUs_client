import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Shield, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer className={`py-8 border-t ${theme.border} mt-12 bg-black/20 backdrop-blur-sm`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

                    <div className="flex items-center space-x-2">
                        <Shield className={`w-6 h-6 ${theme.text}`} />
                        <span className={`text-lg font-bold ${theme.text}`}>PrepUs</span>
                    </div>

                    <p className={`text-sm ${theme.textMuted}`}>
                        Boost Your GK, Crack Competitive Exams
                    </p>

                    <div className="flex space-x-6 text-sm font-medium">
                        <Link to="/about" className={`${theme.textMuted} hover:${theme.text}`}>About Us</Link>
                        <Link to="/contact" className={`${theme.textMuted} hover:${theme.text}`}>Contact Us</Link>
                        <Link to="/terms" className={`${theme.textMuted} hover:${theme.text}`}>Terms</Link>
                        <Link to="/privacy" className={`${theme.textMuted} hover:${theme.text}`}>Privacy Policy</Link>
                    </div>

                    <div className="flex space-x-4">
                        <Facebook className={`w-5 h-5 ${theme.textMuted} hover:${theme.text} cursor-pointer`} />
                        <Twitter className={`w-5 h-5 ${theme.textMuted} hover:${theme.text} cursor-pointer`} />
                        <Youtube className={`w-5 h-5 ${theme.textMuted} hover:${theme.text} cursor-pointer`} />
                    </div>

                </div>
                <div className={`text-center mt-8 text-xs ${theme.textMuted}`}>
                    © 2026 PrepUs
                </div>
            </div>
        </footer>
    );
};

export default Footer;
