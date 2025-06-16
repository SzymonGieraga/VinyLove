import React, { useState } from 'react';
import offerService from '../services/offerService';
import StarRating from './StarRating';

const ReviewModal = ({ offerId, isOpen, onClose, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            setMessage('Proszę wybrać ocenę i wpisać komentarz.');
            return;
        }
        setLoading(true);

        try {
            await offerService.addReviewForOffer(offerId, { rating, comment });
            setRating(0);
            setComment('');
            setMessage('');
            onReviewAdded(); // Odśwież listę recenzji
            onClose();       // Zamknij modal po sukcesie
        } catch (error) {
            setMessage('Wystąpił błąd podczas dodawania recenzji.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="review-modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <form onSubmit={handleSubmit}>
                    <h4>Dodaj swoją recenzję</h4>
                    <div className="form-group">
                        <label>Ocena:</label>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">Komentarz:</label>
                        <textarea
                            id="comment"
                            className="form-control"
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? 'Publikowanie...' : 'Opublikuj recenzję'}
                    </button>
                    {message && <p className="alert alert-danger" style={{marginTop: '1rem'}}>{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;