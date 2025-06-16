import React from 'react';
import { Link } from 'react-router-dom';

const UserOffersTab = ({ offers, isOwner }) => {
    if (offers.length === 0) {
        return <p>Ten użytkownik nie dodał jeszcze żadnych ofert.</p>;
    }

    const handleStatusChange = (offerId, newStatus) => {
        // Logika zmiany statusu - do zaimplementowania
        alert(`Zmiana statusu oferty ${offerId} na ${newStatus}`);
    };

    return (
        <div className="profile-offers-grid">
            {offers.map(offer => {
                const isClickable = offer.status !== 'HIDDEN' && offer.status !== 'ARCHIVED';
                const cardClass = `offer-card ${!isClickable ? 'disabled' : ''}`;

                return (
                    <div key={offer.id} className="profile-offer-item">
                        <Link to={isClickable ? `/offer/${offer.id}` : '#'} className={!isClickable ? 'disabled-link' : ''}>
                            <div className={cardClass}>
                                <img src={offer.coverImageUrl || 'https://placehold.co/400x400/3273dc/ffffff?text=Vinylove'} alt={offer.title} className="offer-card-image" />
                                <div className="offer-card-body">
                                    <h4 className="offer-card-title">{offer.title}</h4>
                                    <p className="offer-card-artist">{offer.artists}</p>
                                    <span className={`status-badge status-${offer.status.toLowerCase()}`}>{offer.status}</span>
                                </div>
                            </div>
                        </Link>
                        {isOwner && (
                            <div className="owner-actions">
                                {/* Przykładowe przyciski do zarządzania */}
                                {offer.status === 'AVAILABLE' && <button onClick={() => handleStatusChange(offer.id, 'HIDDEN')}>Ukryj</button>}
                                {offer.status === 'HIDDEN' && <button onClick={() => handleStatusChange(offer.id, 'AVAILABLE')}>Pokaż</button>}
                                <button onClick={() => handleStatusChange(offer.id, 'ARCHIVED')} className="danger">Archiwizuj</button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default UserOffersTab;