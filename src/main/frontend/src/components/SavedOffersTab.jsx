import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';

const SavedOffersTab = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        userService.getMyObservedOffers()
            .then(response => {
                setOffers(response.data);
            })
            .catch(error => {
                console.error("Błąd pobierania zapisanych ofert:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Ładowanie zapisanych ofert...</p>;
    }

    if (offers.length === 0) {
        return <p>Nie obserwujesz jeszcze żadnych ofert. Znajdź coś dla siebie i kliknij ikonkę zakładki!</p>;
    }

    return (
        <div className="profile-offers-grid">
            {offers.map(offer => {
                const isClickable = true;
                const cardClass = 'offer-card';

                return (
                    <div key={offer.id} className="profile-offer-item">
                        <Link to={`/offer/${offer.id}`}>
                            <div className={cardClass}>
                                <img src={offer.coverImageUrl || 'https://placehold.co/400x400/3273dc/ffffff?text=Vinylove'} alt={offer.title} className="offer-card-image" />
                                <div className="offer-card-body">
                                    <h4 className="offer-card-title">{offer.title}</h4>
                                    <p className="offer-card-artist">{offer.artists}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default SavedOffersTab;
