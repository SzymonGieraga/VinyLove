import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import offerService from '../services/offerService';
import authService from '../services/authService';
import RentalModal from './RentalModal';
import ReviewList from './ReviewList';
import ReviewModal from "./ReviewModal";


const OfferDetailsPage = () => {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);

    const fetchReviews = useCallback(() => {
        offerService.getReviewsForOffer(id)
            .then(response => setReviews(response.data))
            .catch(err => console.error("Błąd ładowania recenzji:", err));
    }, [id]);

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
        fetchReviews();
    }, [id, fetchReviews]);

    const isOwner = currentUser && offer && currentUser.username === offer.ownerUsername;

    if (loading) return <p style={{ textAlign: 'center' }}>Ładowanie...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
    if (!offer) return <p style={{ textAlign: 'center' }}>Nie znaleziono oferty.</p>;

    const coverImageUrl = offer.coverImageUrl || 'https://placehold.co/600x600/3273dc/ffffff?text=Brak+okładki';
    const ownerAvatarUrl = offer.ownerProfileImageUrl || 'https://placehold.co/50x50/3273dc/ffffff?text=U';

    return (
        <>
        {isModalOpen && <RentalModal offer={offer} user={currentUser} onClose={() => setIsModalOpen(false)} />}

            <ReviewModal
                offerId={id}
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onReviewAdded={fetchReviews}
            />

            <div className="offer-details-container">
                <div className="offer-details-main">
                    <div className="offer-details-cover">
                        <img src={coverImageUrl} alt={`Okładka ${offer.title}`}/>
                    </div>
                    <div className="offer-details-info">
                        <h1 className="offer-title">{offer.title}</h1>
                        <h2 className="offer-artist">przez {offer.artists}</h2>
                        <div className="owner-info">
                            <p>Wystawione przez:</p>
                            <Link to={`/profile/${offer.ownerUsername}`} className="owner-link">
                                <img src={ownerAvatarUrl} alt={offer.ownerUsername} className="owner-avatar-small"/>
                                <strong>{offer.ownerUsername}</strong>
                            </Link>
                        </div>

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
                    <div className="reviews-header">
                        <h3>Oceny i Recenzje</h3>
                        {currentUser && (
                            <button className="button" onClick={() => setIsReviewModalOpen(true)}>
                                Dodaj recenzję
                            </button>
                        )}
                    </div>
                    {/* Lista recenzji */}
                    <ReviewList reviews={reviews}/>
                </div>
            </div>
        </>
    );
};

export default OfferDetailsPage;