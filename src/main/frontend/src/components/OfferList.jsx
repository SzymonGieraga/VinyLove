import React, { useState, useEffect, useCallback } from 'react';
import offerService from '../services/offerService';
import OfferCard from './OfferCard';

const OfferList = ({ searchTerm }) => {
    const [offers, setOffers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchOffers = useCallback((page, query) => {
        setLoading(true);

        offerService.getOffers(query, page)
            .then(response => {
                setOffers(response.data.content);
                setCurrentPage(response.data.number);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error("Błąd podczas pobierania ofert:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchOffers(0, searchTerm);
    }, [searchTerm, fetchOffers]);

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        if (nextPage < totalPages) {
            fetchOffers(nextPage, searchTerm);
        }
    };

    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        if (prevPage >= 0) {
            fetchOffers(prevPage, searchTerm);
        }
    };

    if (loading) return <p style={{ textAlign: 'center' }}>Ładowanie ofert...</p>;
    if (offers.length === 0) return <p style={{ textAlign: 'center' }}>Nie znaleziono ofert pasujących do Twojego zapytania.</p>;

    return (
        <div>
            <div className="offer-grid">
                {offers.map(offer => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
            <div className="pagination-controls">
                <button onClick={handlePrevPage} disabled={currentPage === 0}>&larr; Poprzednia</button>
                <span>Strona {currentPage + 1} z {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage + 1 >= totalPages}>Następna &rarr;</button>
            </div>
        </div>
    );
};

export default OfferList;