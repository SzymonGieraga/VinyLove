import React, { useState } from 'react';
import authService from '../services/authService';
import {Link} from "react-router-dom";

const ResetPasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [successful, setSuccessful] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);

        if (newPassword !== confirmPassword) {
            setMessage('Nowe hasła nie są identyczne.');
            return;
        }
        if (newPassword.length < 3) {
            setMessage('Nowe hasło musi mieć co najmniej 6 znaków.');
            return;
        }

        setLoading(true);
        try {
            await authService.changePassword(currentPassword, newPassword);
            setSuccessful(true);
            setMessage('Hasło zostało pomyślnie zmienione.');
        } catch (error) {
            const resMessage = (error.response?.data?.message) || 'Wystąpił błąd podczas zmiany hasła.';
            setMessage(resMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Zmiana Hasła</h2>
            <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                    <label htmlFor="currentPassword">Aktualne hasło</label>
                    <input
                        type="password"
                        id="currentPassword"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">Nowe hasło</label>
                    <input
                        type="password"
                        id="newPassword"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Potwierdź nowe hasło</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-buttons-group">
                    <button className="button is-primary" disabled={loading}>
                        {loading ? 'Zmienianie...' : 'Zmień hasło'}
                    </button>
                    <Link to="/" className="button is-light">
                        Wróć do strony głównej
                    </Link>
                </div>
                {message && (
                    <div className={`alert ${successful ? 'alert-success' : 'alert-danger'}`} style={{marginTop: '1.5rem'}}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ResetPasswordPage;