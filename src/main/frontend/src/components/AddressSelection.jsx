import React from 'react';
import ParcelLockerMap from './ParcelLockerMap';

const AddressSelection = ({ address, setAddress }) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
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
    );
};

export default AddressSelection;