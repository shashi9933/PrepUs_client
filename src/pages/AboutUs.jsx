import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Shield, Target, Users } from 'lucide-react';

const AboutUs = () => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <Shield className="w-16 h-16 mx-auto mb-6 text-blue-500" />
                    <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>About PrepUs</h1>
                    <p className={`text-xl ${theme.textMuted} max-w-2xl mx-auto`}>
                        Empowering aspirants to achieve their dreams through smart, data-driven preparation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>Our Mission</h2>
                        <p className={`${theme.textMuted} leading-relaxed`}>
                            At PrepUs, we believe that every aspirant deserves access to high-quality, affordable, and personalized coaching resources. Our mission is to democratize exam preparation by leveraging technology to identify weak areas, track progress, and provide targeted study plans.
                        </p>
                    </div>
                    <div>
                        <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>Why Choose Us?</h2>
                        <ul className={`space-y-4 ${theme.textMuted}`}>
                            <li className="flex items-start">
                                <Target className="w-5 h-5 mr-3 text-green-500 mt-1" />
                                <span><strong>Smart Analytics:</strong> We don't just give you marks; we tell you <em>where</em> you lost them.</span>
                            </li>
                            <li className="flex items-start">
                                <Users className="w-5 h-5 mr-3 text-blue-500 mt-1" />
                                <span><strong>Community Driven:</strong> Compete with thousands of students on our real-time leaderboard.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar} text-center`}>
                    <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>Join the Revolution</h2>
                    <p className={`${theme.textMuted} mb-6`}>Start your journey with PrepUs today and take the first step towards your dream career.</p>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;
