import React, {useState, useMemo, useCallback, useEffect} from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import reviewService from '../services/reviewService';
import userService from "../services/userService";

const ReviewCard = ({ review, canDelete, onDelete }) => {
    const linkTo = review.reviewType === 'RECORD'
        ? `/offer/${review.subjectId}`
        : `/profile/${review.subjectName}`;

    const subjectImage = review.subjectImageUrl || 'https://placehold.co/50x50/cccccc/ffffff?text=?';
    const authorImage = review.reviewerProfileImageUrl || 'https://placehold.co/50x50/3273dc/ffffff?text=U';

    return (
        <div className="review-card">
            {canDelete && (
                <button onClick={() => onDelete(review.id, review.reviewType)} className="delete-button"
                        title="Usuń recenzję">
                    &times;
                </button>
            )}
            <div className="review-card-author">
                <Link to={`/profile/${review.reviewerUsername}`} className="author-link">
                    <img src={authorImage} alt={review.reviewerUsername} className="author-avatar"/>
                    <span>{review.reviewerUsername}</span>
                </Link>
            </div>
            <Link to={linkTo} className="review-subject-link">
                <img src={subjectImage} alt={review.subjectName} className="review-subject-image"/>
                <div className="review-subject-info">
                    <p><strong>{review.reviewType === 'RECORD' ? 'Recenzja oferty:' : 'Recenzja użytkownika:'}</strong>
                    </p>
                    <p>{review.subjectName}</p>
                </div>
            </Link>
            <div className="review-rating-body">
                <StarRating rating={review.rating} readOnly={true}/>
                <p className="review-comment">{review.comment}</p>
            </div>
            <div className="review-card-footer">
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};


const ProfileReviewsTab = ({username, isOwner}) => {
    const [viewMode, setViewMode] = useState(isOwner ? 'written' : 'about');
    const [filterType, setFilterType] = useState('all');
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchReviews = useCallback((page) => {
        setLoading(true);
        const apiReviewType = filterType === 'offers' ? 'RECORD' : (filterType === 'users' ? 'USER' : 'ALL');
        userService.getProfileReviews(username, viewMode, apiReviewType, page)
            .then(response => {
                setReviews(response.data.content);
                setCurrentPage(response.data.number);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => console.error("Błąd ładowania recenzji:", error))
            .finally(() => setLoading(false));
    }, [username, viewMode, filterType]);

    useEffect(() => {
        fetchReviews(0);
    }, [fetchReviews]);

    const handleDelete = async (reviewId, type) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tę recenzję?")) return;

        try {
            if (type === 'RECORD') {
                await reviewService.deleteRecordReview(reviewId);
            } else {
                await reviewService.deleteUserReview(reviewId);
            }
            alert("Recenzja usunięta.");
            fetchReviews(0);
        } catch (error) {
            alert("Błąd podczas usuwania recenzji.");
        }
    };

    const reviewsToDisplay = useMemo(() => {
        if (!reviews) return [];
        return reviews;
    }, [reviews]);

    return (
        <div className="reviews-tab-container">
            {isOwner && (
                <div className="secondary-tabs">
                    <button className={viewMode === 'written' ? 'active' : ''} onClick={() => setViewMode('written')}>Twoje recenzje</button>
                    <button className={viewMode === 'about' ? 'active' : ''} onClick={() => setViewMode('about')}>Recenzje o Tobie</button>
                </div>
            )}

            <div className="review-filter-tabs">
                <button className={filterType === 'all' ? 'active' : ''} onClick={() => setFilterType('all')}>Wszystkie</button>
                <button className={filterType === 'offers' ? 'active' : ''} onClick={() => setFilterType('offers')}>Ofert</button>
                <button className={filterType === 'users' ? 'active' : ''} onClick={() => setFilterType('users')}>Użytkowników</button>
            </div>

            {loading ? (
                <p>Ładowanie recenzji...</p>
            ) : (
                <>
                    <div className="reviews-grid">
                        {reviewsToDisplay.length > 0 ? (
                            reviewsToDisplay.map(review => (
                                <ReviewCard
                                    key={`${review.reviewType}-${review.id}`}
                                    review={review}
                                    canDelete={isOwner && viewMode === 'written'}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <p>Brak recenzji do wyświetlenia w tej kategorii.</p>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button onClick={() => fetchReviews(currentPage - 1)} disabled={currentPage === 0}>&larr; Poprzednia</button>
                            <span>Strona {currentPage + 1} z {totalPages}</span>
                            <button onClick={() => fetchReviews(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>Następna &rarr;</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfileReviewsTab;
