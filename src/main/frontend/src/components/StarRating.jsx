import React from 'react';

const StarRating = ({ rating, setRating, readOnly = false }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <span
                        key={ratingValue}
                        className={`star ${ratingValue <= rating ? 'filled' : ''} ${readOnly ? 'read-only' : ''}`}
                        onClick={() => !readOnly && setRating(ratingValue)}
                    >
                        &#9733;
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;