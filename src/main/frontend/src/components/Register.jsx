import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Potwierdź hasło</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
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
        </div>
    );
};

export default Register;
