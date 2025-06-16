import React from 'react';
import StarRating from './StarRating';
import {Link} from "react-router-dom";

const ReviewList = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <p>Brak recenzji dla tej płyty.</p>;
    }

    return (
        <div className="reviews-list">
            {reviews.map((review, index) => (
                <div key={index} className={`review-item ${review.hasRented ? 'highlighted' : ''}`}>
                    <Link to={`/profile/${review.authorUsername}`} className="review-author-link">
                        <div className="review-author">
                            <img src={review.authorProfileImageUrl || 'https://placehold.co/50x50/3273dc/ffffff?text=U'} alt={review.authorUsername} />
                            <strong>{review.authorUsername}</strong>
                            {review.hasRented && <span className="rented-badge">✓ Wypożyczono</span>}
                        </div>
                    </Link>
                    <StarRating rating={review.rating} readOnly={true} />
                    <p className="review-comment">{review.comment}</p>
                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;