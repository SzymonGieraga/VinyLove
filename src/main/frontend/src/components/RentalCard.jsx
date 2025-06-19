import React from 'react';
import { Link } from 'react-router-dom';

const RentalCard = ({ rental, isOwnerView, onStatusChange }) => {

    const ownerActions = {
        'REQUESTED': { label: 'Wyślij do wypożyczającego', newStatus: 'SENT_TO_RENTER' },
        'SENT_TO_OWNER': { label: 'Potwierdź zwrot', newStatus: 'RETURNED' },
    };

    const renterActions = {
        'SENT_TO_RENTER': { label: 'Potwierdź odbiór', newStatus: 'DELIVERED' },
        'DELIVERED': { label: 'Zwróć płytę', newStatus: 'SENT_TO_OWNER' },
    };

    const availableAction = isOwnerView ? ownerActions[rental.status] : renterActions[rental.status];

    return (
        <div className="rental-card">
            <img src={rental.offerImageUrl || 'https://placehold.co/80x80'} alt={rental.offerTitle} />
            <div className="rental-info">
                <Link to={`/offer/${rental.offerId}`}><strong>{rental.offerTitle}</strong></Link>
                <p>Status: <span className="status-badge">{rental.status}</span></p>
                <p>{isOwnerView ? 'Wypożyczający' : 'Właściciel'}:
                    <Link to={`/profile/${rental.otherPartyUsername}`}> {rental.otherPartyUsername}</Link>
                </p>
            </div>
            <div className="rental-actions">
                {availableAction && (
                    <button onClick={() => onStatusChange(rental.rentalId, availableAction.newStatus)}>
                        {availableAction.label}
                    </button>
                )}
            </div>
        </div>
    );
};

export default RentalCard;