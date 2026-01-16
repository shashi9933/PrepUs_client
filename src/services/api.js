const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchAllExams = async () => {
    try {
        const response = await fetch(`${API_URL}/exams`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch exams:", error);
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
        return null; // Return null handled by UI
    }
};
