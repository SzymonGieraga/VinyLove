import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import authService from './services/authService';
import './App.css';
import ProfileDropdown from './components/ProfileDropdown';
import AddOfferPage from "./components/AddOfferPage";
import OfferDetailsPage from "./components/OfferDetailsPage";
import UserProfilePage from './components/UserProfilePage';
import ResetPasswordPage from "./components/ResetPasswordPage";
import AdminPage from "./components/AdminPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');


  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const handleLogin = () => {
    setCurrentUser(authService.getCurrentUser());
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
      <Router>
        <div>
          <nav className="navbar">
            <div className="navbar-brand">
              <Link to="/" className="navbar-item">Vinylove</Link>
            </div>
            <div className="navbar-menu">
              <div className="navbar-start">
              </div>
              {currentUser ? (
                  <div className="navbar-end">
                    <ProfileDropdown user={currentUser} onLogout={handleLogout} onToggleTheme={toggleTheme} currentTheme={theme} />
                  </div>
              ) : (
                  <div className="navbar-end">
                    <div className="navbar-item">
                      <Link to="/login" className="button is-light">Logowanie</Link>
                    </div>
                    <div className="navbar-item">
                      <Link to="/register" className="button is-primary">Rejestracja</Link>
                    </div>
                  </div>
              )}
            </div>
          </nav>

          <div className="container mt-3">
            <Routes>
              <Route path="/" element={<Home user={currentUser} />} />
              <Route path="/home" element={<Navigate to="/" />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add-offer" element={currentUser ? <AddOfferPage /> : <Navigate to="/login" />} />
              <Route path="/offer/:id" element={<OfferDetailsPage />} />

              <Route path="/my-profile" element={currentUser ? <Navigate to={`/profile/${currentUser.username}`} /> : <Navigate to="/login" />} />
              <Route path="/profile/:username" element={<UserProfilePage />} />

              <Route path="/reset-password" element={currentUser ? <ResetPasswordPage /> : <Navigate to="/login" />} />
              <Route
                  path="/admin"
                  element={currentUser && currentUser.role === 'ROLE_ADMIN' ? <AdminPage /> : <Navigate to="/" />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
