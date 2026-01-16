import React from 'react';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicy = () => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className={`text-3xl font-bold mb-8 ${theme.text}`}>Privacy Policy</h1>
                <div className={`prose ${theme.isDark ? 'prose-invert' : ''} max-w-none`}>
                    <p className={theme.textMuted}>Last updated: January 2026</p>

                    <h3 className={`${theme.text} mt-6 mb-2 text-xl font-bold`}>1. Information We Collect</h3>
                    <p className={theme.textMuted}>We collect information you provide directly to us, such as when you create an account, participate in a quiz, or request customer support.</p>

                    <h3 className={`${theme.text} mt-6 mb-2 text-xl font-bold`}>2. How We Use Information</h3>
                    <p className={theme.textMuted}>We use the information we collect to provide, maintain, and improve our services, such as to track your progress and generate personalized study plans.</p>

                    <h3 className={`${theme.text} mt-6 mb-2 text-xl font-bold`}>3. Data Security</h3>
                    <p className={theme.textMuted}>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

                    <h3 className={`${theme.text} mt-6 mb-2 text-xl font-bold`}>4. Cookies</h3>
                    <p className={theme.textMuted}>We use cookies and similar technologies to collect information about your interaction with our Services.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
