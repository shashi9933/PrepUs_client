import apiClient from './apiClient';

// Helper to safely extract data or return default
const safeRequest = async (request, defaultValue = null) => {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        console.error("API Request Failed:", error?.response?.data || error.message);
        // Throw proper error for UI to handle if needed, or return default
        if (defaultValue !== undefined) return defaultValue;
        throw error;
    }
};

// --- Exams & Categories ---

export const fetchAllExams = (category = null) => {
    const url = category ? `/exams?category=${category}` : '/exams';
    return safeRequest(() => apiClient.get(url), []);
};

export const fetchCategories = () =>
    safeRequest(() => apiClient.get('/categories'), []);

export const fetchExamById = (id) =>
    safeRequest(() => apiClient.get(`/exams/${id}`));

// --- Auth ---

export const sendOtp = (phone) =>
    safeRequest(() => apiClient.post('/auth/send-otp', { phone }));

export const verifyOtp = (phone, otp) =>
    safeRequest(() => apiClient.post('/auth/verify-otp', { phone, otp }));

export const updateProfile = (data) =>
    safeRequest(() => apiClient.post('/auth/update-profile', data));

export const register = (data) =>
    safeRequest(() => apiClient.post('/auth/register', data));

export const loginEmail = (data) =>
    safeRequest(() => apiClient.post('/auth/login-email', data));

// --- Tests ---

export const fetchDailyTest = (examId) =>
    safeRequest(() => apiClient.get(`/tests/daily/${examId}`));

export const submitTestAttempt = (payload) =>
    safeRequest(() => apiClient.post('/tests/submit', payload));

export const fetchTestById = (testId) =>
    safeRequest(() => apiClient.get(`/tests/${testId}`));

export const fetchQuizTemplates = (category = 'All') =>
    safeRequest(() => apiClient.get(`/tests/templates?category=${category}`), []);

// --- Generation (Legacy/Strictly Controlled) ---

export const generateTest = (payload) =>
    safeRequest(() => apiClient.post('/tests/generate', payload));

// --- Analytics ---

export const fetchAnalytics = (userId, timeRange = '30d') =>
    safeRequest(() => apiClient.get(`/analytics/dashboard?userId=${userId}&range=${timeRange}`));
