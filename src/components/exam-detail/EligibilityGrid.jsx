import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { GraduationCap, Users, CalendarClock, Globe } from 'lucide-react';

const EligibilityCard = ({ icon: Icon, title, value, theme, onClick, hasDetails }) => (
    <div
        onClick={onClick}
        className={`p-6 rounded-xl border ${theme.sidebar} ${theme.border} ${theme.shadow} flex flex-col items-center text-center cursor-pointer hover:bg-white/5 transition-all group`}
    >
        <div className={`p-3 rounded-full bg-white/5 ${theme.text} mb-3 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
        </div>
        <h3 className={`font-semibold ${theme.textMuted} text-sm mb-1`}>{title}</h3>
        <p className={`font-bold ${theme.text} text-lg`}>{value}</p>

        {hasDetails && (
            <span className="text-[10px] text-blue-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Click for details
            </span>
        )}
    </div>
);

const EligibilityGrid = ({ eligibility }) => {
    const { theme } = useTheme();
    const [detailView, setDetailView] = useState(null); // 'age' or 'attempts'

    return (
        <div className="mb-8 p-6 rounded-xl border-2 border-dashed border-gray-700/30">
            <h2 className={`text-xl font-bold mb-6 ${theme.text}`}>Eligibility Criteria</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <EligibilityCard
                    icon={Globe}
                    title="Nationality"
                    value={eligibility.nationality}
                    theme={theme}
                />
                <EligibilityCard
                    icon={CalendarClock}
                    title="Age Limit"
                    value={`${eligibility.age.min} - ${eligibility.age.max} Yrs`}
                    theme={theme}
                    hasDetails={true}
                    onClick={() => setDetailView(detailView === 'age' ? null : 'age')}
                />
                <EligibilityCard
                    icon={GraduationCap}
                    title="Education"
                    value={eligibility.education}
                    theme={theme}
                />
                <EligibilityCard
                    icon={Users}
                    title="Attempts"
                    value={typeof eligibility.attempts.general !== 'undefined' ? `${eligibility.attempts.general} (Gen)` : 'Unlimited'}
                    theme={theme}
                    hasDetails={true}
                    onClick={() => setDetailView(detailView === 'attempts' ? null : 'attempts')}
                />
            </div>

            {/* Expandable Details Section */}
            {detailView && (
                <div className={`mt-4 p-4 rounded-lg bg-white/5 border ${theme.border} animate-fade-in`}>
                    <h3 className={`text-sm font-bold ${theme.text} mb-3 uppercase tracking-wider`}>
                        {detailView === 'age' ? 'Category-wise Age Relaxation' : 'Number of Attempts per Category'}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {detailView === 'age' ? (
                            <>
                                <div className="flex justify-between p-2 rounded bg-white/5"><span className={theme.textMuted}>SC/ST</span> <span className={theme.accentText}>+{eligibility.ageRelaxation.sc_st} Yrs</span></div>
                                <div className="flex justify-between p-2 rounded bg-white/5"><span className={theme.textMuted}>OBC</span> <span className={theme.accentText}>+{eligibility.ageRelaxation.obc} Yrs</span></div>
                                <div className="flex justify-between p-2 rounded bg-white/5"><span className={theme.textMuted}>PwD</span> <span className={theme.accentText}>+{eligibility.ageRelaxation.pwd} Yrs</span></div>
                                <div className="flex justify-between p-2 rounded bg-white/5"><span className={theme.textMuted}>General</span> <span className={theme.text}>No Relaxation</span></div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between p-2 rounded bg-white/5"><span className={theme.textMuted}>General</span> <span className={theme.text}>{eligibility.attempts.general}</span></div>
                                <div className="flex justify-between p-2 rounded bg-white/5"><span className={theme.textMuted}>OBC</span> <span className={theme.text}>{eligibility.attempts.obc}</span></div>
                                <div className="flex justify-between p-2 rounded bg-white/5"><span className={theme.textMuted}>SC/ST</span> <span className={theme.accentText}>{eligibility.attempts.sc_st}</span></div>
                                <div className="flex justify-between p-2 rounded bg-white/5"><span className={theme.textMuted}>PwD</span> <span className={theme.text}>{eligibility.attempts.pwd}</span></div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EligibilityGrid;
