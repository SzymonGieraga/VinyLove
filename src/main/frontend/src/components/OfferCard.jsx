import React from 'react';
import { Link } from 'react-router-dom';

const OfferCard = ({ offer }) => {
    const imageUrl = offer.coverImageUrl || 'https://placehold.co/400x400/3273dc/ffffff?text=Vinylove';

    return (
        <Link to={`/offer/${offer.id}`} className="offer-card-link">
            <div className="offer-card">
                <img src={imageUrl} alt={offer.title} className="offer-card-image" />
                <div className="offer-card-body">
                    <div className="offer-card-details">
                        <h4 className="offer-card-title">{offer.title}</h4>
                        <p className="offer-card-artist">{offer.artists}</p>
                    </div>
                    {offer.reviewCount > 0 && (
                        <div className="offer-card-rating">
                            <span className="star-icon">&#9733;</span>
                            <span>{offer.averageRating.toFixed(1)}</span>
                            <span className="review-count">({offer.reviewCount})</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default OfferCard;