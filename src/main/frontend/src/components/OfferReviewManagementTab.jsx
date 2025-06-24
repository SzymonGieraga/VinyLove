import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';
import { Link } from 'react-router-dom';

const OfferReviewManagementTab = () => {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchReviews = useCallback((pageNum) => {
        setLoading(true);
        adminService.getOfferReviews(pageNum)
            .then(response => {
                setReviews(response.data.content);
                setPage(response.data.number);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => console.error("Błąd pobierania recenzji ofert:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchReviews(0);
    }, [fetchReviews]);

    const handleDelete = (reviewId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę recenzję? Tej akcji nie można cofnąć.')) {
            adminService.deleteOfferReview(reviewId)
                .then(() => {
                    alert("Recenzja została usunięta.");
                    fetchReviews(page);
                })
                .catch(() => alert("Wystąpił błąd podczas usuwania recenzji."));
        }
    };

    if (loading) return <p>Ładowanie recenzji ofert...</p>;

    return (
        <div>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Ocena</th>
                    <th>Komentarz</th>
                    <th>Autor</th>
                    <th>Oferta (ID / Tytuł)</th>
                    <th>Data</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map(review => (
                    <tr key={review.id}>
                        <td>{review.id}</td>
                        <td>{review.rating} ★</td>
                        <td>{review.comment}</td>
                        <td>
                            <Link to={`/profile/${review.authorUsername}`}>{review.authorUsername}</Link>
                        </td>
                        <td>
                            <Link to={`/offer/${review.offerId}`}>#{review.offerId} - {review.offerTitle}</Link>
                        </td>
                        <td>{new Date(review.createdAt).toLocaleString()}</td>
                        <td>
                            <button onClick={() => handleDelete(review.id)} className="button is-small is-danger">
                                Usuń
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OfferReviewManagementTab;