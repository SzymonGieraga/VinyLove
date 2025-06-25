import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import offerService from '../services/offerService';
import authService from '../services/authService';
import observationService from '../services/observationService';
import RentalModal from './RentalModal';
import ReviewList from './ReviewList';
import ReviewModal from "./ReviewModal";

const BookmarkIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
         fill={filled ? "currentColor" : "none"} stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
);


const OfferDetailsPage = () => {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);

    const [isObserved, setIsObserved] = useState(false); // <-- NOWY STAN

    const fetchOfferAndReviews = useCallback(() => {
        offerService.getOfferDetails(id)
            .then(response => {
                setOffer(response.data);
                setIsObserved(response.data.isObserved);
                setLoading(false);
            })
            .catch(err => {
                setError('Nie można załadować oferty.');
                setLoading(false);
            });

        offerService.getReviewsForOffer(id)
            .then(response => setReviews(response.data))
            .catch(err => console.error("Błąd ładowania recenzji:", err));
    }, [id]);

    useEffect(() => {
        setCurrentUser(authService.getCurrentUser());
        fetchOfferAndReviews();
    }, [id, fetchOfferAndReviews]);

    const handleToggleObservation = () => {
        if (isObserved) {
            observationService.unobserveOffer(id).then(() => setIsObserved(false));
        } else {
            observationService.observeOffer(id).then(() => setIsObserved(true));
        }
    };

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
                onReviewAdded={fetchOfferAndReviews}
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

                        <div className="offer-actions">
                            {currentUser ? (
                                <button className="button is-primary rent-button" onClick={() => setIsModalOpen(true)} disabled={isOwner}>
                                    {isOwner ? 'To Twoja oferta' : 'Wypożycz'}
                                </button>
                            ) : (
                                <p><Link to="/login">Zaloguj się</Link>, aby wypożyczyć.</p>
                            )}

                            {/* NOWY PRZYCISK OBSERWOWANIA */}
                            {currentUser && (
                                <button
                                    className={`button observe-button ${isObserved ? 'is-observed' : ''}`}
                                    onClick={handleToggleObservation}
                                    disabled={isOwner}
                                    title={isObserved ? "Usuń z obserwowanych" : "Dodaj do obserwowanych"}
                                >
                                    <BookmarkIcon filled={isObserved} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="offer-reviews-section">
                    <div className="reviews-header">
                        <h3>Oceny i Recenzje</h3>
                        {offer.reviewCount > 0 && (
                            <div className="average-rating-header">
                                <span className="star-icon">&#9733;</span>
                                <strong>{offer.averageRating.toFixed(1)}</strong>
                                <span className="review-count">({offer.reviewCount} {offer.reviewCount === 1 ? 'ocena' : 'ocen'})</span>
                            </div>
                        )}
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