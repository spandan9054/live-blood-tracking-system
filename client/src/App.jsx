import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import EmergencyFAB from './components/common/EmergencyFAB';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HospitalList from './pages/HospitalList';
import UserDashboard from './pages/UserDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/about" element={<LandingPage />} /> {/* Simple mirror for demo */}
              <Route path="/contact" element={<LandingPage />} /> {/* Simple mirror for demo */}

              {/* Protected Routes */}
              <Route path="/hospitals" element={
                <ProtectedRoute>
                  <HospitalList />
                </ProtectedRoute>
              } />
              
              <Route path="/user-dashboard" element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              } />

              <Route path="/hospital-dashboard" element={
                <ProtectedRoute role="hospital">
                  <HospitalDashboard />
                </ProtectedRoute>
              } />


            </Routes>
          </main>
          <EmergencyFAB />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
