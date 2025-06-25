import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import EditOfferModal from './EditOfferModal';

const OfferManagementTab = () => {
    const [offers, setOffers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);

    const fetchOffers = useCallback((pageNum) => {
        setLoading(true);
        adminService.getOffers(pageNum)
            .then(response => {
                setOffers(response.data.content);
                setPage(response.data.number);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => console.error("Błąd pobierania ofert:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchOffers(0);
    }, [fetchOffers]);

    const handleEditClick = (offer) => {
        setSelectedOffer(offer);
        setIsEditModalOpen(true);
    };

    const handleOfferUpdated = () => {
        fetchOffers(page);
    };

    if (loading) return <p>Ładowanie ofert...</p>;

    return (
        <>
            <EditOfferModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                offer={selectedOffer}
                onOfferUpdated={handleOfferUpdated}
            />

            <div>
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tytuł</th>
                        <th>Artysta</th>
                        <th>Właściciel</th>
                        <th>Status</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {offers.map(offer => (
                        <tr key={offer.id}>
                            <td>{offer.id}</td>
                            <td><Link to={`/offer/${offer.id}`}>{offer.title}</Link></td>
                            <td>{offer.artists}</td>
                            <td><Link to={`/profile/${offer.ownerUsername}`}>{offer.ownerUsername}</Link></td>
                            <td>
                                <span className={`status-badge status-${offer.status.toLowerCase()}`}>
                                    {offer.status}
                                </span>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleEditClick(offer)}
                                    className="button is-small"
                                >
                                    Edytuj
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default OfferManagementTab;