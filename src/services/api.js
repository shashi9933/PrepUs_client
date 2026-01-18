const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Helper function for fetch with auth
const fetchWithAuth = (url, options = {}) => {
    return fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        },
        credentials: 'include' // Include cookies/credentials
    });
};

export const fetchAllExams = async (category = null) => {
    try {
        let url = `${API_URL}/exams`;
        if (category) url += `?category=${category}`;

        const response = await fetchWithAuth(url);
        if (!response.ok) throw new Error(`Failed to fetch exams: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

export const fetchCategories = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL}/categories`);
        if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

export const fetchExamById = async (id) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/exams/${id}`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch exam ${id}:`, error);
        return null;
    }
};

// Auth
export const sendOtp = (phone) =>
    fetchWithAuth(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        body: JSON.stringify({ phone }),
    }).then(res => res.json());

export const verifyOtp = (phone, otp) =>
    fetchWithAuth(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
    }).then(res => res.json());

export const updateProfile = (data) =>
    fetchWithAuth(`${API_URL}/auth/update-profile`, {
        method: 'POST',
        body: JSON.stringify(data),
    }).then(res => res.json());

export const register = (data) =>
    fetchWithAuth(`${API_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
    }).then(res => res.json());

export const loginEmail = (data) =>
    fetchWithAuth(`${API_URL}/auth/login-email`, {
        method: 'POST',
        body: JSON.stringify(data),
    }).then(res => res.json());

export const fetchDailyTest = async (examId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/tests/daily/${examId}`);
        if (!response.ok) throw new Error(`Failed to fetch daily test: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

export const submitTestAttempt = async (payload) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/tests/submit`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Failed to submit test: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

export const fetchAnalytics = async (userId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/analytics/dashboard?userId=${userId}`);
        if (!response.ok) throw new Error(`Failed to fetch analytics: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null; // Return null to handle UI loading/error states
    }
};

export const generateTest = async (payload) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/tests/generate`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Failed to generate test: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

export const fetchTestById = async (testId) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/tests/${testId}`);
        if (!response.ok) throw new Error(`Failed to fetch test: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};
