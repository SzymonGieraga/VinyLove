import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ProfileDropdown = ({ user, onLogout, onToggleTheme, currentTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="profile-dropdown" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="profile-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-header">
                        Zalogowano jako <br />
                        <strong>{user.username}</strong>
                    </div>
                    <Link to="/my-profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        Przejdź do profilu
                    </Link>
                    <Link to="/reset-password" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        Resetuj hasło
                    </Link>
                    <button onClick={onToggleTheme} className="dropdown-item dropdown-item-button">
                        Zmień motyw ({currentTheme === 'light' ? 'Ciemny' : 'Jasny'})
                    </button>
                    <div className="dropdown-divider"></div>
                    <button onClick={onLogout} className="dropdown-item dropdown-item-button">
                        Wyloguj
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;