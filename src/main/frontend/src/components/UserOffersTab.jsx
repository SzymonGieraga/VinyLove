import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditOfferModal from './EditOfferModal';

const UserOffersTab = ({ offers, isOwner, onOfferUpdated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);

    if (offers.length === 0) {
        return <p>Ten użytkownik nie dodał jeszcze żadnych ofert.</p>;
    }

    const handleEditClick = (offer) => {
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    return (
        <>
            <EditOfferModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                offer={selectedOffer}
                onOfferUpdated={onOfferUpdated}
            />

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
                                    <button onClick={() => handleEditClick(offer)}>Edytuj</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default UserOffersTab;