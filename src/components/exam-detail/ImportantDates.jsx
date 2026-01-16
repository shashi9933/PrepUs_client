import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Calendar } from 'lucide-react';

const ImportantDates = ({ dates }) => {
    const { theme } = useTheme();

    // Convert dates object to array for easier mapping
    const timeline = [
        { label: 'Notification', date: dates.notification },
        { label: 'Applications', date: dates.applicationStart },
        { label: 'Admit Card', date: dates.admitCard },
        { label: 'Exam Date', date: dates.examDate, highlight: true },
        { label: 'Result', date: dates.result }
    ];

    return (
        <div className={`p-6 rounded-xl border ${theme.sidebar} ${theme.border} ${theme.shadow} mb-8`}>
            <div className="flex items-center mb-6">
                <Calendar className={`w-5 h-5 mr-2 ${theme.text}`} />
                <h2 className={`text-xl font-bold ${theme.text}`}>Important Dates</h2>
            </div>

            <div className="relative">
                {/* Mobile: Vertical, Desktop: Horizontal */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0 relative z-10">
                    {timeline.map((item, idx) => (
                        <div key={idx} className="flex md:flex-col items-center md:text-center group">
                            {/* Connector (Desktop) */}
                            {idx !== timeline.length - 1 && (
                                <div className={`hidden md:block absolute top-[18px] left-[${(idx * 20) + 10}%] w-[20%] h-0.5 ${theme.border} z-[-1]`}></div>
                            )}

                            {/* Dot */}
                            <div className={`w-4 h-4 rounded-full border-2 ${item.highlight ? 'bg-blue-500 border-blue-500 animate-pulse' : `bg-white ${theme.border}`} z-10 md:mb-3 mr-4 md:mr-0`}></div>

                            {/* Content */}
                            <div>
                                <p className={`text-xs uppercase tracking-wider ${theme.textMuted} mb-1`}>{item.label}</p>
                                <p className={`font-semibold ${item.highlight ? 'text-blue-500' : theme.text}`}>{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Horizontal Line Background (Desktop) */}
                <div className={`hidden md:block absolute top-[7px] left-0 w-full h-0.5 bg-gray-700/30 z-0`}></div>
            </div>
        </div>
    );
};

export default ImportantDates;
