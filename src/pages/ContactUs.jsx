import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>Contact Us</h1>
                    <p className={`text-xl ${theme.textMuted} max-w-2xl mx-auto`}>
                        Have questions? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className={`p-6 rounded-2xl border ${theme.border} ${theme.sidebar}`}>
                            <Mail className="w-8 h-8 text-blue-500 mb-4" />
                            <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Email Us</h3>
                            <p className={theme.textMuted}>support@prepus.com</p>
                            <p className={theme.textMuted}>business@prepus.com</p>
                        </div>

                        <div className={`p-6 rounded-2xl border ${theme.border} ${theme.sidebar}`}>
                            <Phone className="w-8 h-8 text-green-500 mb-4" />
                            <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Call Us</h3>
                            <p className={theme.textMuted}>+91 98765 43210</p>
                            <p className={`text-xs ${theme.textMuted} mt-1`}>(Mon-Fri, 9AM - 6PM)</p>
                        </div>

                        <div className={`p-6 rounded-2xl border ${theme.border} ${theme.sidebar}`}>
                            <MapPin className="w-8 h-8 text-red-500 mb-4" />
                            <h3 className={`text-lg font-bold ${theme.text} mb-2`}>Visit Us</h3>
                            <p className={theme.textMuted}>123, Tech Park, Sector 62,<br />Noida, Uttar Pradesh, India</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={`p-8 rounded-2xl border ${theme.border} ${theme.sidebar} h-fit`}>
                        <form className="space-y-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Name</label>
                                <input type="text" className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="Your Name" />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Email</label>
                                <input type="email" className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="Your Email" />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Message</label>
                                <textarea rows="4" className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="How can we help?"></textarea>
                            </div>
                            <button className="w-full flex items-center justify-center py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg">
                                <Send className="w-4 h-4 mr-2" /> Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;
