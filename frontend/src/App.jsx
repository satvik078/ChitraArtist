import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
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
      </AuthProvider>
    </Router>
  );
}

export default App;
