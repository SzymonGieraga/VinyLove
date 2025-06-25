import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import accountService from '../services/accountService';

const FundAccountPage = () => {
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
    const [amount, setAmount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvc, setCvc] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [newBalancePreview, setNewBalancePreview] = useState(
        currentUser ? (parseFloat(currentUser.balance) || 0) : 0
    );

    useEffect(() => {
        if (currentUser) {
            const currentBalance = parseFloat(currentUser.balance) || 50;
            const currentAmount = parseFloat(amount) || 50;

            if (currentAmount > 0) {
                setNewBalancePreview(currentBalance + currentAmount);
            } else {
                setNewBalancePreview(currentBalance);
            }
        }
    }, [amount, currentUser]);

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        const formattedValue = value.match(/.{1,4}/g)?.join(' ').substr(0, 19) || '';
        setCardNumber(formattedValue);
    };

    const handleCvcChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setCvc(value.substr(0, 3));
    };

    const handleFundAccount = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const fundAmount = parseFloat(amount);
        if (isNaN(fundAmount) || fundAmount <= 0) {
            setMessage("Proszę podać prawidłową, dodatnią kwotę.");
            setLoading(false);
            return;
        }

        try {
            const response = await accountService.fundAccount(fundAmount);
            const newBalance = response.data.newBalance;
            const updatedUser = { ...currentUser, balance: newBalance };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            setMessage(`Konto zostało pomyślnie doładowane! Nowe saldo: ${newBalance.toFixed(2)} PLN`);
            setAmount('');
            setCardNumber('');
            setCvc('');
        } catch (error) {
            setMessage("Wystąpił błąd podczas doładowywania konta.");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <p>Ładowanie...</p>;
    }

    return (
        <div className="form-container" style={{maxWidth: '600px'}}>
            <div className="profile-header" style={{borderBottom: 'none', paddingBottom: '1rem'}}>
                <img src={currentUser.profileImageUrl || 'https://placehold.co/150x150/3273dc/ffffff?text=U'} alt={currentUser.username} className="profile-avatar" />
                <div className="profile-info">
                    <h1>{currentUser.username}</h1>
                    <p>Aktualne saldo: <strong>{(parseFloat(currentUser.balance) || 0).toFixed(2)} PLN</strong></p>
                </div>
            </div>

            <form onSubmit={handleFundAccount} style={{marginTop: '2rem'}}>
                <div className="form-group">
                    <label htmlFor="amount">Kwota doładowania (PLN)</label>
                    <input type="number" id="amount" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="np. 50.00" min="0.01" step="0.01" required />
                </div>
                <div className="form-group">
                    <label htmlFor="cardNumber">Numer karty</label>
                    <input type="text" id="cardNumber" className="form-control" value={cardNumber} onChange={handleCardNumberChange} placeholder="xxxx xxxx xxxx xxxx" required />
                </div>
                <div className="form-group">
                    <label htmlFor="cvc">Kod CVC</label>
                    <input type="text" id="cvc" className="form-control" value={cvc} onChange={handleCvcChange} placeholder="123" required style={{maxWidth: '100px'}} />
                </div>
                <div className="balance-info">
                    <p>Balans po doładowaniu: <strong>{newBalancePreview.toFixed(2)} PLN</strong></p>
                </div>
                <div className="form-group">
                    <button type="submit" className="button is-primary" disabled={loading}>
                        {loading ? 'Przetwarzanie...' : 'Doładuj konto'}
                    </button>
                </div>
                {message && (
                    <div className="form-group">
                        <div className="alert alert-info" role="alert">{message}</div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default FundAccountPage;
