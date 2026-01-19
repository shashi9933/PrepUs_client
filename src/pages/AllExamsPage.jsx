import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { fetchAllExams } from '../services/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Award, Building2, Briefcase, Users, Train, Globe, Building, FileText, AlertCircle } from 'lucide-react';
import VideoLoader from '../components/VideoLoader';

// Valid Category Slugs (Standardized)
const CATEGORIES = [
    { label: 'All', slug: null },
    { label: 'Banking', slug: 'banking' },
    { label: 'SSC', slug: 'ssc' },
    { label: 'Defence', slug: 'defence' },
    { label: 'Railways', slug: 'railways' },
    { label: 'State PSC', slug: 'state-psc' },
    { label: 'Teaching', slug: 'teaching' },
    { label: 'UPSC', slug: 'upsc' },
    { label: 'Regulatory', slug: 'regulatory' },
    { label: 'Insurance', slug: 'insurance' }
];

const iconMap = {
    banking: Briefcase,
    ssc: Building2,
    defence: Users,
    railways: Train,
    'state-psc': Globe,
    insurance: Building,
    teaching: FileText,
    upsc: Award,
    regulatory: Building
};

const AllExamsPage = () => {
    const { theme } = useTheme();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Fetch Data from Backend
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAllExams();
                setExams(data);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch exams:", error);
                setError('Failed to load exams. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Sync URL param with internal state
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam.toLowerCase());
        } else {
            setSelectedCategory(null);
        }
    }, [location]);

    // Update URL when category changes
    const handleCategoryChange = (slug) => {
        setSelectedCategory(slug);
        if (slug) {
            navigate(`/exams?category=${slug}`);
        } else {
            navigate('/exams');
        }
    };

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

        const examCategorySlug = exam.category?.toLowerCase() || '';
        const matchesCategory = selectedCategory
            ? examCategorySlug === selectedCategory.toLowerCase()
            : true;

        return matchesSearch && matchesCategory;
    });

    // Helper: Count exams for a category
    const getCategoryCount = (slug) => {
        if (!slug) return exams.length;
        return exams.filter(e => (e.category?.toLowerCase() || '') === slug).length;
    };

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
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() => handleCategoryChange(cat.slug)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${(selectedCategory === cat.slug) || (!selectedCategory && !cat.slug)
                                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                                    : `bg-white/5 ${theme.text} hover:bg-white/10 border ${theme.border}`
                                }`}
                        >
                            {cat.label} <span className="opacity-60 ml-1 text-xs">({getCategoryCount(cat.slug)})</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                {loading ? (
                    <VideoLoader />
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center space-x-2 text-red-400 bg-red-400/10 px-6 py-3 rounded-xl border border-red-400/20">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    </div>
                ) : (
                    /* Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExams.map((exam) => {
                            const catKey = exam.category?.toLowerCase();
                            const Icon = iconMap[catKey] || FileText;

                            return (
                                <Link to={`/exams/${exam.id}`} key={exam.id} className={`block group`}>
                                    <div className={`h-full p-6 rounded-2xl border ${theme.border} ${theme.sidebar} ${theme.shadow} hover:scale-[1.02] transition-transform`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-lg bg-blue-500/10 ${theme.text}`}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${theme.border} ${theme.textMuted} capitalize`}>
                                                {exam.category}
                                            </span>
                                        </div>

                                        <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>{exam.title}</h3>
                                        <p className={`text-sm ${theme.textMuted} mb-4 line-clamp-2`}>{exam.subtitle}</p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-700/30">
                                            <div className="text-xs">
                                                <span className="block text-gray-500">Vacancies</span>
                                                <span className={`font-semibold ${theme.text}`}>{exam.quickInfo?.vacancies || '—'}</span>
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

                {!loading && !error && filteredExams.length === 0 && (
                    <div className="text-center py-12">
                        <p className={theme.textMuted}>No exams found matching "{searchTerm}"</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllExamsPage;
