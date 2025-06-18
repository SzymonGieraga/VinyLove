import React, { useState } from 'react';
import StarRating from './StarRating';
import reviewService from '../services/reviewService';

const UserReviewForm = ({ reviewedUsername, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            setMessage('Proszę wybrać ocenę i wpisać komentarz.');
            return;
        }
        setLoading(true);
        setMessage('');

        try {
            await reviewService.addUserReview(reviewedUsername, { rating, comment });
            onSuccess();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Wystąpił błąd podczas dodawania recenzji.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form-in-modal">
            <div className="form-group">
                <label>Twoja ocena:</label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
            <div className="form-group">
                <label htmlFor="user-review-comment">Komentarz:</label>
                <textarea
                    id="user-review-comment"
                    className="form-control"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
            </div>
            <button type="submit" className="button is-primary" disabled={loading}>
                {loading ? 'Wysyłanie...' : 'Wyślij recenzję'}
            </button>
            {message && <p className="alert alert-danger" style={{marginTop: '1rem'}}>{message}</p>}
        </form>
    );
};

export default UserReviewForm;