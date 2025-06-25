import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import authService from '../services/authService';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState('');

    const validateForm = () => {
        if (password !== confirmPassword) {
            setMessage("Hasła nie są identyczne.");
            return false;
        }

        if (password.length < 3) {
            setMessage("Hasło musi mieć co najmniej 3 znaków.");
            return false;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setMessage("Proszę podać prawidłowy adres email.");
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);

        if (!validateForm()) {
            return;
        }

        try {
            await authService.register(username, email, password);
            setMessage('Rejestracja zakończona sukcesem! Za chwilę zostaniesz przeniesiony/a na stronę logowania...');
            setSuccessful(true);

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                "Wystąpił błąd podczas rejestracji.";
            setMessage(resMessage);
            setSuccessful(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Rejestracja</h2>
            <form onSubmit={handleRegister}>
                {!successful && (
                    <div>
                        <div className="form-group">
                            <label htmlFor="username">Nazwa użytkownika</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Hasło</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    className="form-control has-toggle-button"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className="password-toggle-button" onClick={() => setPasswordVisible(!passwordVisible)}>
                                    {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Potwierdź hasło</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    className="form-control has-toggle-button"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className="password-toggle-button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                                    {confirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <button className="button is-primary">Zarejestruj się</button>
                        </div>
                    </div>
                )}
                {message && (
                    <div className="form-group">
                        <div className={successful ? 'alert alert-success' : 'alert alert-danger'} role="alert">
                            {message}
                        </div>
                    </div>
                )}
            </form>

            {!successful && (
                <div className="form-footer-link">
                    Masz już konto? <Link to="/login">Zaloguj się!</Link>
                </div>
            )}
        </div>
    );
};

export default Register;