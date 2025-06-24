import React, { useState, useEffect } from 'react';
import ParcelLockerMap from './ParcelLockerMap';
import userService from '../services/userService';

const AddressSelection = ({ address, setAddress }) => {
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectionMode, setSelectionMode] = useState('new');

    useEffect(() => {
        userService.getMyAddresses()
            .then(response => {
                setSavedAddresses(response.data);
            })
            .catch(error => console.error("Błąd pobierania adresów:", error));
    }, []);

    const handleModeChange = (mode) => {
        setSelectionMode(mode);
        setAddress({ type: 'HOME', street: '', city: '', postalCode: '', country: 'Polska' });
    };

    const handleSavedAddressSelect = (e) => {
        const addressId = e.target.value;
        if (!addressId) return;

        const selected = savedAddresses.find(addr => addr.id.toString() === addressId);
        if (selected) {
            setAddress(selected);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value, id: null }));
    };

    const handleLockerSelect = (lockerAddress) => {
        setAddress(prev => ({
            ...prev,
            street: lockerAddress,
            city: 'N/A',
            postalCode: 'N/A',
            country: 'Polska'
        }));
    };

    return (
        <div className="address-selection-container">
            <div className="secondary-tabs">
                <button type="button" className={selectionMode === 'new' ? 'active' : ''} onClick={() => handleModeChange('new')}>Nowy adres</button>
                {savedAddresses.length > 0 && (
                    <button type="button" className={selectionMode === 'saved' ? 'active' : ''} onClick={() => handleModeChange('saved')}>Użyj zapisanego</button>
                )}
            </div>

            {selectionMode === 'saved' && (
                <div className="form-group">
                    <label>Wybierz adres z listy:</label>
                    <select className="form-control" onChange={handleSavedAddressSelect}>
                        <option value="">-- Wybierz --</option>
                        {savedAddresses.map(addr => (
                            <option key={addr.id} value={addr.id}>
                                {`${addr.street}, ${addr.city}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {selectionMode === 'new' && (
                <div>
            <label>Typ adresu zwrotnego:</label>
            <div className="delivery-options">
                <button
                    type="button"
                    className={address.type === 'HOME' ? 'active' : ''}
                    onClick={() => setAddress(prev => ({ ...prev, type: 'HOME' }))}>
                    Adres domowy
                </button>
                <button
                    type="button"
                    className={address.type === 'PARCEL_LOCKER' ? 'active' : ''}
                    onClick={() => setAddress(prev => ({ ...prev, type: 'PARCEL_LOCKER' }))}>
                    Paczkomat
                </button>
            </div>

            {address.type === 'HOME' && (
                <div className="address-form-fields">
                    <input type="text" name="street" placeholder="Ulica i numer" className="form-control" value={address.street || ''} onChange={handleInputChange} required />
                    <input type="text" name="city" placeholder="Miasto" className="form-control" value={address.city || ''} onChange={handleInputChange} required />
                    <input type="text" name="postalCode" placeholder="Kod pocztowy" className="form-control" value={address.postalCode || ''} onChange={handleInputChange} required />
                    <input type="text" name="country" placeholder="Kraj" className="form-control" value={address.country || 'Polska'} onChange={handleInputChange} required />
                </div>
            )}

            {address.type === 'PARCEL_LOCKER' && (
                <div>
                    <ParcelLockerMap onSelectLocker={handleLockerSelect} />
                    {address.street && <p style={{marginTop: '0.5rem'}}>Wybrano: <strong>{address.street}</strong></p>}
                </div>
            )}
                </div>
            )}
        </div>
    );
};

export default AddressSelection;