import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VideoLoader from '../components/VideoLoader';

const OnboardingGuard = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <VideoLoader />;

    // If user is logged in but hasn't completed onboarding (checking specific flags or just existence of targetExam)
    // Adjust logic based on your User model. Assuming 'targetExam' or 'onboardingCompleted' flag.
    // The previous instructions suggested onboardingStatus or similar. 
    // Let's use validation of a key field like 'targetExam' or an explicit 'onboardingCompleted' flag if you added one.

    // For now, let's assume if they don't have a name or targetExam, they need onboarding.
    const isOnboardingComplete = user?.onboardingCompleted || (user?.name && user?.targetExam);

    if (user && !isOnboardingComplete) {
        return <Navigate to="/onboarding" replace />;
    }

    return children;
};

export default OnboardingGuard;
