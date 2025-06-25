import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import rentalService from '../services/rentalService';
import authService from "../services/authService";
import AddressSelection from './AddressSelection';

const RentalModal = ({ offer, onClose }) => {
    const [rentalDays, setRentalDays] = useState(7);
    const [address, setAddress] = useState({
        type: 'HOME',
        street: '',
        city: '',
        postalCode: '',
        country: 'Polska'
    });

    const [currentUser, setCurrentUser] = useState(null);
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const RENTAL_DEPOSIT = 50.00;

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user && typeof user.balance === 'undefined') {
            user.balance = 100.00;
        }
        setCurrentUser(user);
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!address.street) {
            setMessage('Proszę podać lub wybrać adres dostawy.');
            return;
        }
        setMessage('');
        setStep(2);
    };

    const handleConfirmRental = async () => {
        setLoading(true);
        setMessage('');

        const rentalData = {
            offerId: offer.id,
            rentalDays,
            deliveryAddress: address,
        };

        try {
            await rentalService.createRental(rentalData);
            setMessage('Wypożyczenie zostało pomyślnie zgłoszone! Zaraz zostaniesz przeniesiony na stronę główną.');

            setTimeout(() => {
                onClose(); // Zamknij modal przed przekierowaniem
                navigate('/');
            }, 2000);

        } catch (error) {
            const resMessage = (error.response?.data?.message) || 'Wystąpił błąd podczas wypożyczania.';
            setMessage(resMessage);
            setLoading(false);
            setStep(1);
        }
    };

    const handleAddFunds = () => {
        alert("Symulacja: Przekierowanie do strony płatności...");
        const updatedUser = { ...currentUser, balance: currentUser.balance + 50 };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify({ ...authService.getCurrentUser(), balance: updatedUser.balance }));
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>Wypożycz: {offer.title}</h2>

                {step === 1 && (
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label>Czas wypożyczenia: {rentalDays} dni</label>
                            <input type="range" min="1" max="30" value={rentalDays} onChange={(e) => setRentalDays(e.target.value)} className="form-range" />
                        </div>

                        <div className="form-group">
                            <label>Adres dostawy</label>
                            <AddressSelection address={address} setAddress={setAddress} />
                        </div>

                        <div className="form-group">
                            <button type="submit" className="button is-primary" style={{marginTop: '1rem'}}>Dalej</button>
                        </div>
                    </form>
                )}

                {step === 2 && currentUser && (
                    <div className="deposit-step">
                        <h3>Potwierdzenie Kaucji</h3>
                        <div className="balance-info">
                            <p>Twoje saldo: <strong>{currentUser.balance.toFixed(2)} PLN</strong></p>
                            <p>Wymagana kaucja zwrotna: <strong>{RENTAL_DEPOSIT.toFixed(2)} PLN</strong></p>
                        </div>

                        {currentUser.balance >= RENTAL_DEPOSIT ? (
                            <>
                                <p className="alert-info">Z Twojego konta zostanie pobrana kaucja, która wróci po zwrocie płyty.</p>
                                <button onClick={handleConfirmRental} className="button is-primary" disabled={loading}>
                                    {loading ? 'Przetwarzanie...' : 'Potwierdź i zablokuj kaucję'}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="alert alert-danger">Masz za mało środków na koncie, aby wypożyczyć tę płytę.</p>
                                <button onClick={() => { handleAddFunds() }} className="button">
                                    Doładuj konto (Symulacja)
                                </button>
                            </>
                        )}
                    </div>
                )}

                {message && <div className="alert alert-info" style={{marginTop: '1rem'}}>{message}</div>}
            </div>
        </div>
    );
};

export default RentalModal;
