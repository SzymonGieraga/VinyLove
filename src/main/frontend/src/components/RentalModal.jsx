import React, {useEffect, useState} from 'react';
import rentalService from '../services/rentalService';
import ParcelLockerMap from './ParcelLockerMap';
import authService from "../services/authService";

const RentalModal = ({ offer, user, onClose }) => {
    const [rentalDays, setRentalDays] = useState(7);
    const [deliveryMethod, setDeliveryMethod] = useState('home');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [currentUser, setCurrentUser] = useState(null);


    const RENTAL_DEPOSIT = 50.00;

    useEffect(() => {
        const user = authService.getCurrentUser();
        user.balance = user.balance || 100.00;
        setCurrentUser(user);
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!deliveryAddress) {
            setMessage('Proszę podać adres dostawy lub wybrać paczkomat.');
            return;
        }
        setMessage('');
        setStep(2);
    };

    const handleAddFunds = () => {
        alert("Symulacja: Przekierowanie do strony płatności...");
        const updatedUser = { ...currentUser, balance: currentUser.balance + 50 };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify({ ...authService.getCurrentUser(), balance: updatedUser.balance }));
    };

    const handleConfirmRental = async () => {
        setLoading(true);
        setMessage('');

        const rentalData = { offerId: offer.id, rentalDays, deliveryMethod, deliveryAddress };

        try {
            await rentalService.createRental(rentalData);
            setMessage('Wypożyczenie zostało pomyślnie zgłoszone!');
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            const resMessage = (error.response?.data?.message) || 'Wystąpił błąd podczas wypożyczania.';
            setMessage(resMessage);
            setLoading(false);
            setStep(1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!deliveryAddress) {
            setMessage('Proszę podać adres dostawy lub wybrać paczkomat.');
            return;
        }
        setLoading(true);
        setMessage('');

        const rentalData = {
            offerId: offer.id,
            rentalDays,
            deliveryMethod,
            deliveryAddress,
        };

        try {
            await rentalService.createRental(rentalData);
            setMessage('Wypożyczenie zostało pomyślnie złożone!');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            const resMessage = (error.response?.data?.message) || 'Wystąpił błąd podczas wypożyczania.';
            setMessage(resMessage);
            setLoading(false);
        }
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
                        <label>Metoda dostawy:</label>
                        <div className="delivery-options">
                            <button type="button" className={deliveryMethod === 'home' ? 'active' : ''} onClick={() => setDeliveryMethod('home')}>Dostawa do domu</button>
                            <button type="button" className={deliveryMethod === 'locker' ? 'active' : ''} onClick={() => setDeliveryMethod('locker')}>Paczkomat</button>
                        </div>
                    </div>

                    {deliveryMethod === 'home' && (
                        <div className="form-group">
                            <label htmlFor="address">Adres dostawy:</label>
                            <input type="text" id="address" className="form-control" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="ul. Przykładowa 1, 00-000 Miasto" />
                        </div>
                    )}

                    {deliveryMethod === 'locker' && (
                        <div className="form-group">
                            <label>Wybierz paczkomat z mapy:</label>
                            <ParcelLockerMap onSelectLocker={(lockerAddress) => setDeliveryAddress(lockerAddress)} />
                            {deliveryAddress && <p style={{marginTop: '0.5rem'}}>Wybrano: <strong>{deliveryAddress}</strong></p>}
                        </div>
                    )}

                            <div className="form-group">
                                <button type="submit" className="button is-primary">Dalej</button>
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
                                    <button onClick={handleAddFunds} className="button">
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