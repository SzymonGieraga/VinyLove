import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import offerService from '../services/offerService';
import authService from '../services/authService';
import RentalModal from './RentalModal';


const OfferDetailsPage = () => {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Stan do kontroli modala

    useEffect(() => {
        setCurrentUser(authService.getCurrentUser()); // Pobierz aktualnego użytkownika

        offerService.getOfferDetails(id)
            .then(response => {
                setOffer(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Nie można załadować oferty.');
                setLoading(false);
            });
    }, [id]);

    const isOwner = currentUser && offer && currentUser.username === offer.ownerUsername;

    if (loading) return <p style={{ textAlign: 'center' }}>Ładowanie...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
    if (!offer) return <p style={{ textAlign: 'center' }}>Nie znaleziono oferty.</p>;

    const coverImageUrl = offer.coverImageUrl || 'https://placehold.co/600x600/3273dc/ffffff?text=Brak+okładki';

    return (
        <>
        {isModalOpen && <RentalModal offer={offer} user={currentUser} onClose={() => setIsModalOpen(false)} />}

        <div className="offer-details-container">
            <div className="offer-details-main">
                <div className="offer-details-cover">
                    <img src={coverImageUrl} alt={`Okładka ${offer.title}`} />
                </div>
                <div className="offer-details-info">
                    <h1 className="offer-title">{offer.title}</h1>
                    <h2 className="offer-artist">przez {offer.artists}</h2>
                    <p className="offer-owner">Wystawione przez: <strong>{offer.ownerUsername}</strong></p>

                    {offer.audioSampleUrl && (
                        <div className="audio-player">
                            <p>Próbka audio:</p>
                            <audio controls src={offer.audioSampleUrl}>
                                Twoja przeglądarka nie obsługuje elementu audio.
                            </audio>
                        </div>
                    )}

                    <p className="offer-description">{offer.description}</p>

                    {currentUser ? (
                        <button
                            className="button is-primary rent-button"
                            onClick={() => setIsModalOpen(true)}
                            disabled={isOwner}
                        >
                            {isOwner ? 'To Twoja oferta' : 'Wypożycz'}
                        </button>
                    ) : (
                        <p>
                            <Link to="/login">Zaloguj się</Link>, aby wypożyczyć.
                        </p>
                    )}
                </div>
            </div>

            <div className="offer-reviews-section">
                <h3>Oceny i Recenzje</h3>
                <div className="reviews-list">
                    <p>Brak recenzji dla tej płyty.</p>
                </div>
                <button className="button">Dodaj ocenę</button>
            </div>
        </div>
        </>
    );
};

export default OfferDetailsPage;