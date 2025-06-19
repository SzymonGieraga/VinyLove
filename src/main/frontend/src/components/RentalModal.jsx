import React, { useState, useEffect } from 'react';
import rentalService from '../services/rentalService';
import ParcelLockerMap from './ParcelLockerMap';
import authService from "../services/authService";

const RentalModal = ({ offer, onClose }) => {
    // --- Stany formularza ---
    const [rentalDays, setRentalDays] = useState(7);
    const [address, setAddress] = useState({
        type: 'HOME',
        street: '',
        city: '',
        postalCode: '',
        country: 'Polska'
    });

    // --- Stany logiki ---
    const [currentUser, setCurrentUser] = useState(null);
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const RENTAL_DEPOSIT = 50.00;

    useEffect(() => {
        const user = authService.getCurrentUser();
        // Symulacja salda (w przyszłości powinno przychodzić z API)
        user.balance = user.balance || 100.00;
        setCurrentUser(user);
    }, []);

    const handleAddressTypeChange = (type) => {
        const newAddress = { type, street: '', city: '', postalCode: '', country: 'Polska' };
        setAddress(newAddress);
    };

    const handleAddFunds = () => {
        alert("Symulacja: Przekierowanie do strony płatności...");
        const updatedUser = { ...currentUser, balance: currentUser.balance + 50 };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify({ ...authService.getCurrentUser(), balance: updatedUser.balance }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!address.street) {
            setMessage('Proszę podać adres dostawy lub wybrać paczkomat.');
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
            deliveryAddress: address // Wysyłamy cały obiekt adresu
        };

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

    // ... (funkcja handleAddFunds bez zmian)

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
                                <button type="button" className={address.type === 'HOME' ? 'active' : ''} onClick={() => handleAddressTypeChange('HOME')}>Dostawa do domu</button>
                                <button type="button" className={address.type === 'PARCEL_LOCKER' ? 'active' : ''} onClick={() => handleAddressTypeChange('PARCEL_LOCKER')}>Paczkomat</button>
                            </div>
                        </div>

                        {address.type === 'HOME' && (
                            <div className="address-form-fields">
                                <input type="text" name="street" placeholder="Ulica i numer" className="form-control" value={address.street || ''} onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))} required />
                                <input type="text" name="city" placeholder="Miasto" className="form-control" value={address.city || ''} onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))} required />
                                <input type="text" name="postalCode" placeholder="Kod pocztowy" className="form-control" value={address.postalCode || ''} onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))} required />
                            </div>
                        )}

                        {address.type === 'PARCEL_LOCKER' && (
                            <div className="form-group">
                                <label>Wybierz paczkomat z mapy:</label>
                                <ParcelLockerMap onSelectLocker={(lockerAddress) => setAddress({ type: 'PARCEL_LOCKER', street: lockerAddress, city: 'N/A', postalCode: 'N/A', country: 'Polska' })} />
                                {address.street && <p style={{marginTop: '0.5rem'}}>Wybrano: <strong>{address.street}</strong></p>}
                            </div>
                        )}
                        <div className="form-group">
                            <button type="submit" className="button is-primary" style={{marginTop: '0.5rem'}}>Dalej</button>
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