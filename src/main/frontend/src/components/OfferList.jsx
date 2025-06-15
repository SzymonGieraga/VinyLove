import React, { useState, useEffect } from 'react';
import offerService from '../services/offerService';
import OfferCard from './OfferCard';

const OfferList = () => {
    const [offers, setOffers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchOffers = (page) => {
        setLoading(true);
        offerService.getOffers(page)
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
    };

    useEffect(() => {
        fetchOffers(0);
    }, []);

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        if (nextPage < totalPages) {
            fetchOffers(nextPage);
        }
    };

    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        if (prevPage >= 0) {
            fetchOffers(prevPage);
        }
    };

    if (loading) {
        return <p style={{ textAlign: 'center' }}>Ładowanie ofert...</p>;
    }

    if (offers.length === 0) {
        return <p style={{ textAlign: 'center' }}>Brak dostępnych ofert.</p>;
    }

    return (
        <div>
            <div className="offer-grid">
                {offers.map(offer => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
            <div className="pagination-controls">
                <button onClick={handlePrevPage} disabled={currentPage === 0}>
                    &larr; Poprzednia
                </button>
                <span>
                    Strona {currentPage + 1} z {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                    Następna &rarr;
                </button>
            </div>
        </div>
    );
};

export default OfferList;