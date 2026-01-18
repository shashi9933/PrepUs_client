const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchAllExams = async (category = null) => {
    try {
        let url = `${API_URL}/exams`;
        if (category) url += `?category=${category}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch exams');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};

export const fetchExamById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/exams/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch exam ${id}:`, error);
        return null;
    }
};

// Auth
export const sendOtp = (phone) =>
    fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
    }).then(res => res.json());

export const verifyOtp = (phone, otp) =>
    fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
    }).then(res => res.json());

export const updateProfile = (data) =>
    fetch(`${API_URL}/auth/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(res => res.json());

export const register = (data) =>
    fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(res => res.json());

export const loginEmail = (data) =>
    fetch(`${API_URL}/auth/login-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(res => res.json());

export const fetchDailyTest = async (examId) => {
    try {
        const response = await fetch(`${API_URL}/tests/daily/${examId}`);
        if (!response.ok) throw new Error('Failed to fetch daily test');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

export const submitTestAttempt = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/tests/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to submit test');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

export const fetchAnalytics = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/analytics/dashboard?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null; // Return null to handle UI loading/error states
    }
};

export const generateTest = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/tests/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to generate test');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

export const fetchTestById = async (testId) => {
    try {
        const response = await fetch(`${API_URL}/tests/${testId}`);
        if (!response.ok) throw new Error('Failed to fetch test');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};
