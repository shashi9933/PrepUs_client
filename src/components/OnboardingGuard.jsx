import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VideoLoader from '../components/VideoLoader';

const OnboardingGuard = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <VideoLoader />;

    // Check if user profile is complete using isProfileComplete flag
    // This flag comes from backend and is stored in localStorage
    const isProfileComplete = user?.isProfileComplete === true;

    if (user && !isProfileComplete) {
        return <Navigate to="/onboarding" replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default OnboardingGuard;
