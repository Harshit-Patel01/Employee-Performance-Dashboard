import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import AIRecommendations from './pages/AIRecommendations';
import CandidateProfile from './pages/CandidateProfile';
import Navbar from './components/Navbar';
import CandidateNavbar from './components/CandidateNavbar';
import { authService } from './services/api';
import './App.css';

function AppContent({ isAuthenticated, setIsAuthenticated, userRole, loading }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const showSidebar = isAuthenticated && !isAuthPage;

  // Show loading while userRole is being fetched
  if (loading && isAuthenticated && !isAuthPage) {
    return <div className="loading">Loading...</div>;
  }

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const HRRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (userRole !== 'hr') return <Navigate to="/profile" />;
    return children;
  };

  const CandidateRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (userRole === 'hr') return <Navigate to="/" />;
    return children;
  };

  return (
    <div className="App">
      {showSidebar && userRole === 'hr' && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      {showSidebar && userRole === 'candidate' && <CandidateNavbar setIsAuthenticated={setIsAuthenticated} />}
      <div className={showSidebar ? 'app-main' : ''}>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />

          {/* HR Routes */}
          <Route
            path="/"
            element={
              <HRRoute>
                <Dashboard />
              </HRRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <HRRoute>
                <EmployeeList />
              </HRRoute>
            }
          />
          <Route
            path="/ai-recommendations"
            element={
              <HRRoute>
                <AIRecommendations />
              </HRRoute>
            }
          />

          {/* Candidate Routes */}
          <Route
            path="/profile"
            element={
              <CandidateRoute>
                <CandidateProfile />
              </CandidateRoute>
            }
          />
          <Route
            path="/add-employee"
            element={
              <PrivateRoute>
                <AddEmployee />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('userRole');

    if (token) {
      setIsAuthenticated(true);
      if (savedRole) {
        setUserRole(savedRole);
        setLoading(false);
      } else {
        fetchUserRole();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUserRole(response.data.data.role);
      localStorage.setItem('userRole', response.data.data.role);
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userRole={userRole}
        loading={loading}
      />
    </Router>
  );
}

export default App;
