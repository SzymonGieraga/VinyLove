import React, { useState } from 'react';
import authService from '../services/authService';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);

        try {
            await authService.register(username, email, password);
            setMessage('Rejestracja zakończona sukcesem! Możesz się teraz zalogować.');
            setSuccessful(true);
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