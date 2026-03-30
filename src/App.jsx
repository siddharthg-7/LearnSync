import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentOnboarding from './pages/student/StudentOnboarding';
import Courses from './pages/student/Courses';
import Doubts from './pages/student/Doubts';
import StudyPlan from './pages/student/StudyPlan';
import Profile from './pages/student/Profile';
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorOnboarding from './pages/mentor/MentorOnboarding';
import Students from './pages/mentor/Students';
import MentorDoubts from './pages/mentor/MentorDoubts';
import ContentCreation from './pages/mentor/ContentCreation';
import MentorSessions from './pages/mentor/MentorSessions';
import AdminDashboard from './pages/admin/AdminDashboard';
import Modules from './pages/admin/Modules';
import Sessions from './pages/admin/Sessions';
import AIInsights from './pages/admin/AIInsights';
import Feedback from './pages/admin/Feedback';

const AppRoutes = () => {
  const { currentRole, currentUser, updateCurrentUser, switchRole } = useApp();

  const handleLogin = (user, role) => {
    switchRole(role);
    if (user.id === 'new') {
      // New user - will go to onboarding with empty user
      updateCurrentUser({ id: 'new', onboarded: false });
    } else {
      // Existing user - go to dashboard
      updateCurrentUser(user);
    }
  };

  const handleOnboardingComplete = (user) => {
    updateCurrentUser(user);
  };

  // If no user is logged in, show login page
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // If student is not onboarded, show student onboarding
  if (currentRole === 'student' && !currentUser.onboarded) {
    return <StudentOnboarding onComplete={handleOnboardingComplete} />;
  }

  // If mentor is not onboarded, show mentor onboarding
  if (currentRole === 'mentor' && !currentUser.onboarded) {
    return <MentorOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Layout>
      <Routes>
        {/* Student Routes */}
        {currentRole === 'student' && (
          <>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/study-plan" element={<StudyPlan />} />
            <Route path="/doubts" element={<Doubts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* Mentor Routes */}
        {currentRole === 'mentor' && (
          <>
            <Route path="/mentor" element={<MentorDashboard />} />
            <Route path="/mentor/students" element={<Students />} />
            <Route path="/mentor/content" element={<ContentCreation />} />
            <Route path="/mentor/sessions" element={<MentorSessions />} />
            <Route path="/mentor/doubts" element={<MentorDoubts />} />
            <Route path="*" element={<Navigate to="/mentor" replace />} />
          </>
        )}

        {/* Admin Routes */}
        {currentRole === 'admin' && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/modules" element={<Modules />} />
            <Route path="/admin/sessions" element={<Sessions />} />
            <Route path="/admin/insights" element={<AIInsights />} />
            <Route path="/admin/feedback" element={<Feedback />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        )}
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
