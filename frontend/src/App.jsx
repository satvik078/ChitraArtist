import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './Components/Navbar';
import ProtectedRoute from './Components/ProtectedRoute';
import Landing from './Pages/Landing';
import ArtistSignup from './Pages/ArtistSignup';
import ArtistLogin from './Pages/ArtistLogin';
import PublicPortfolio from './Pages/PublicPortfolio';
import MyDashboard from './Pages/MyDashboard';
import ProfileSettings from './Pages/ProfileSettings';
import CompetitionDashboard from './Pages/CompetitionDashboard';

function AppContent() {
  const location = useLocation();
  const isPortfolioPage = location.pathname.startsWith('/artist/');

  return (
    <div className="min-h-screen bg-gray-50">
      {!isPortfolioPage && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<ArtistSignup />} />
        <Route path="/login" element={<ArtistLogin />} />
        <Route path="/artist/:username" element={<PublicPortfolio />} />
        <Route path="/competition" element={<CompetitionDashboard />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
