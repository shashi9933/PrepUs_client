import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import AllExamsPage from './pages/AllExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import StudyPlanPage from './pages/StudyPlanPage';
import MockTestsPage from './pages/MockTestsPage';
import QuizzesPage from './pages/QuizzesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import QuizInterfacePage from './pages/QuizInterfacePage';
import FocusModePage from './pages/FocusModePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import OnboardingPage from './pages/OnboardingPage';

// Home Component (Refactored from previous App.jsx)
// We create a simpler wrapper for the Landing Page content
import HeroSection from './components/HeroSection';
import DashboardPreview from './components/DashboardPreview';
import FeaturesSection from './components/FeaturesSection';
import ExamCategories from './components/ExamCategories';
import TrendingQuizzes from './components/TrendingQuizzes';
import DetailedFeatures from './components/DetailedFeatures';
import LeaderboardSection from './components/LeaderboardSection';
import WeakAreasSection from './components/WeakAreasSection';

const HomePage = () => (
  <>
    <HeroSection />
    <DashboardPreview />
    <ExamCategories />
    <TrendingQuizzes />
    <FeaturesSection />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LeaderboardSection />
        <WeakAreasSection />
      </div>
    </div>
    <DetailedFeatures />
  </>
);

function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />

              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/exams" element={<AllExamsPage />} />
                  <Route path="/exams/:examId" element={<ExamDetailPage />} />
                  <Route path="/exams/:examId/study-plan" element={<StudyPlanPage />} />
                  <Route path="/exams/:examId/study-plan" element={<StudyPlanPage />} />
                  <Route path="/exams/:examId/mock-tests" element={<MockTestsPage />} />
                  <Route path="/quizzes" element={<QuizzesPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/quiz" element={<QuizInterfacePage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </ThemeProvider>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
