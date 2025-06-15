import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import authService from './services/authService';
import './App.css';
import UserProfile from './components/UserProfile';
import ProfileDropdown from './components/ProfileDropdown';
import AddOfferPage from "./components/AddOfferPage";
import OfferDetailsPage from "./components/OfferDetailsPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

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
  }

  return (
      <Router>
        <div>
          <nav className="navbar">
            <div className="navbar-brand">
              <Link to="/" className="navbar-item">Vinylove</Link>
            </div>
            <div className="navbar-menu">
              <div className="navbar-start">
                {/* Usunięto link /offers, ponieważ logo prowadzi do strony głównej */}
                {currentUser && (
                    <Link to="/my-profile" className="navbar-item">Mój Profil</Link>
                )}
              </div>
              {currentUser ? (
                  <div className="navbar-end">
                    <ProfileDropdown user={currentUser} onLogout={handleLogout} />
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
              <Route path="/home" element={<Home user={currentUser} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-profile" element={currentUser ? <UserProfile /> : <Navigate to="/login" />} />

              <Route path="/add-offer" element={currentUser ? <AddOfferPage /> : <Navigate to="/login" />} />

              <Route path="/offer/:id" element={<OfferDetailsPage />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
