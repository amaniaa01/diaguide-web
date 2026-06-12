import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import GlucoseLog from './pages/GlucoseLog';
import DoseCalculator from './pages/DoseCalculator';
import Notifications from './pages/Notifications';
import AIGuidance from './pages/AIGuidance';
import { requestNotificationPermission, showGlucoseReminder } from './firebase';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  useEffect(() => {
    // Only request permission if user is logged in
   const authToken = localStorage.getItem('token');
if (authToken) {
  // Wait for service worker to be ready before requesting permission
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
      requestNotificationPermission();
    });
  }
}

    const checkAndNotify = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        showGlucoseReminder();
      }
    };

    setTimeout(checkAndNotify, 5000);

    const interval = setInterval(checkAndNotify, 8 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile-setup" element={
        <ProtectedRoute><ProfileSetup /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/glucose" element={
        <ProtectedRoute><GlucoseLog /></ProtectedRoute>
      } />
      <Route path="/dose" element={
        <ProtectedRoute><DoseCalculator /></ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute><Notifications /></ProtectedRoute>
      } />
      <Route path="/ai-guidance" element={
        <ProtectedRoute><AIGuidance /></ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;