import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { fetchAllExams } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import { Search, X, Loader2, Award, Building2, Briefcase, Users, Train, Globe, Building, FileText } from 'lucide-react';

const iconMap = {
    'Banking': Briefcase,
    'SSC': Building2,
    'Defence': Users,
    'Railways': Train,
    'State PSC': Globe,
    'Insurance': Building,
    'Teaching': FileText,
    'UPSC': Award,
    'Regulatory': Building // RBI
};

const AllExamsPage = () => {
    const { theme } = useTheme();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const location = useLocation();

    // Fetch Data from Backend
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAllExams();
                setExams(data);
            } catch (error) {
                console.error("Failed to fetch exams:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [location]);

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory
            ? (exam.category?.toLowerCase() === selectedCategory.toLowerCase() || exam.title.toLowerCase().includes(selectedCategory.toLowerCase()))
            : true;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className={`min-h-screen pt-24 pb-12 ${theme.bg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className={`text-4xl font-bold mb-4 ${theme.text}`}>All Exams</h1>
                    <p className={`${theme.textMuted} max-w-2xl mx-auto`}>Explore our comprehensive list of competitive exams and start your preparation journey.</p>
                </div>

                {/* Search */}
                <div className="max-w-xl mx-auto mb-12 relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                    <input
                        type="text"
                        placeholder="Search exams (e.g., SBI PO, UPSC)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${theme.border} bg-white/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.text}`}
                    />
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {['All', 'Banking', 'SSC', 'Defence', 'Railways', 'State PSC', 'Teaching', 'UPSC', 'Regulatory'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${(selectedCategory === cat) || (!selectedCategory && cat === 'All')
                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                : `bg-white/5 ${theme.text} hover:bg-white/10 border ${theme.border}`
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className={`w-12 h-12 animate-spin ${theme.text}`} />
                    </div>
                ) : (
                    /* Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExams.map((exam) => {
                            const Icon = iconMap[exam.category] || FileText;
                            return (
                                <Link to={`/exams/${exam.id}`} key={exam.id} className={`block group`}>
                                    <div className={`h-full p-6 rounded-2xl border ${theme.border} ${theme.sidebar} ${theme.shadow} hover:scale-[1.02] transition-transform`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-lg bg-blue-500/10 ${theme.text}`}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${theme.border} ${theme.textMuted}`}>
                                                {exam.category}
                                            </span>
                                        </div>

                                        <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>{exam.title}</h3>
                                        <p className={`text-sm ${theme.textMuted} mb-4 line-clamp-2`}>{exam.subtitle}</p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-700/30">
                                            <div className="text-xs">
                                                <span className="block text-gray-500">Vacancies</span>
                                                <span className={`font-semibold ${theme.text}`}>{exam.quickInfo.vacancies}</span>
                                            </div>
                                            <div className="text-xs text-right">
                                                <span className="block text-gray-500">Exam Date</span>
                                                <span className={`font-semibold ${theme.text}`}>{exam.dates?.examDate || 'TBD'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredExams.length === 0 && (
                    <div className="text-center py-12">
                        <p className={theme.textMuted}>No exams found matching "{searchTerm}"</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllExamsPage;
