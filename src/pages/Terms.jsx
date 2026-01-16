import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Terms = () => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className={`text-3xl font-bold mb-8 ${theme.text}`}>Terms of Service</h1>
                <div className={`prose ${theme.isDark ? 'prose-invert' : ''} max-w-none`}>
                    <p className={theme.textMuted}>Last updated: January 2026</p>

                    <h3 className={`${theme.text} mt-6 mb-2 text-xl font-bold`}>1. Acceptance of Terms</h3>
                    <p className={theme.textMuted}>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h3 className={`${theme.text} mt-6 mb-2 text-xl font-bold`}>2. Use License</h3>
                    <p className={theme.textMuted}>Permission is granted to temporarily download one copy of the materials (information or software) on PrepUs's website for personal, non-commercial transitory viewing only.</p>

                    <h3 className={`${theme.text} mt-6 mb-2 text-xl font-bold`}>3. User Account</h3>
                    <p className={theme.textMuted}>To access certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.</p>

                    <h3 className={`${theme.text} mt-6 mb-2 text-xl font-bold`}>4. Content Liability</h3>
                    <p className={theme.textMuted}>PrepUs does not guarantee the accuracy, completeness, or usefulness of any information on the site and simply provides a platform for educational purposes.</p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
