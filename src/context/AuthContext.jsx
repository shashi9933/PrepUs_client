import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            try {
                const parsed = JSON.parse(storedUser);
                // Optional: Check token expiry if decoded, otherwise rely on API 401 interceptor
                setUser(parsed);
            } catch {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } else {
            // Clean up partial state
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        setLoading(false);
    }, []);

    const login = async (userData, token) => {
        const session = {
            ...userData,
            loggedInAt: Date.now()
        };
        setUser(session);
        localStorage.setItem('user', JSON.stringify(session));
        if (token) {
            localStorage.setItem('token', token);
        }
        return true;
    };

    const logout = () => {
        if (user?.provider === 'google') {
            googleLogout();
        }
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login'; // Force redirect to clear any app state
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
