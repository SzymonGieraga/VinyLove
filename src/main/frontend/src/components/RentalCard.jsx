import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
};

const getStatusDetails = (status, isOwnerView) => {
    const statusMap = {
        REQUESTED: { label: 'Oczekuje na wysłanie', className: 'status-requested' },
        SENT_TO_RENTER: { label: 'Wysłano do Ciebie', className: 'status-pending' },
        DELIVERED: { label: 'Dostarczono', className: 'status-info' },
        SENT_TO_OWNER: { label: 'W drodze zwrotnej', className: 'status-pending' },
        RETURNED: { label: 'Zwrócono', className: 'status-returned' },
    };

    if (status === 'SENT_TO_RENTER' && isOwnerView) {
        return { label: 'Wysłano do klienta', className: 'status-info' };
    }
    if (status === 'DELIVERED' && isOwnerView) {
        return { label: 'Odebrano przez klienta', className: 'status-pending' };
    }
    if (status === 'SENT_TO_OWNER' && !isOwnerView) {
        return { label: 'Zwrócono', className: 'status-info' };
    }

    return statusMap[status] || { label: status, className: 'status-badge' };
};


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
    const statusDetails = getStatusDetails(rental.status, isOwnerView);

    return (
        <div className="rental-card">
            <img src={rental.offerImageUrl || 'https://placehold.co/80x80'} alt={rental.offerTitle} />
            <div className="rental-info">
                <Link to={`/offer/${rental.offerId}`}><strong>{rental.offerTitle}</strong></Link>
                <p>
                    Status: <span className={`status-badge ${statusDetails.className}`}>{statusDetails.label}</span>
                </p>
                <p>{isOwnerView ? 'Wypożyczający' : 'Właściciel'}:
                    <Link to={`/profile/${rental.otherPartyUsername}`} className="profile-link"> {rental.otherPartyUsername}</Link>
                </p>
                <p className="rental-dates">
                    Wypożyczono: {formatDate(rental.rentalDate)} | Zwrot do: {formatDate(rental.returnDate)}
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