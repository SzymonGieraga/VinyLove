import React, { useState, useEffect, useCallback } from 'react';
import rentalService from '../services/rentalService';
import RentalCard from './RentalCard';

const PaginatedRentalList = ({ username, viewMode }) => {
    const [rentals, setRentals] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchRentals = useCallback((pageNum) => {
        rentalService.getProfileRentals(username, viewMode, pageNum)
            .then(res => {
                setRentals(res.data.content);
                setPage(res.data.number);
                setTotalPages(res.data.totalPages);
            });
    }, [username, viewMode]);

    useEffect(() => { fetchRentals(0); }, [fetchRentals]);

    const handleStatusChange = (rentalId, newStatus) => {
        rentalService.updateRentalStatus(rentalId, newStatus).then(() => fetchRentals(page));
    };

    return (
        <div>
            {rentals.length > 0 ? (
                rentals.map(r => <RentalCard key={r.rentalId} rental={r} isOwnerView={viewMode === 'ownedBy'} onStatusChange={handleStatusChange} />)
            ) : <p>Brak wypożyczeń w tej kategorii.</p>}

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={() => fetchRentals(page - 1)} disabled={page === 0}>&larr;</button>
                    <span>Strona {page + 1} z {totalPages}</span>
                    <button onClick={() => fetchRentals(page + 1)} disabled={page + 1 >= totalPages}>&rarr;</button>
                </div>
            )}
        </div>
    );
};

const ProfileRentalsTab = ({ username, isOwner }) => {
    const [activeSubTab, setActiveSubTab] = useState('rentedBy');

    if (!isOwner) {
        return <PaginatedRentalList username={username} viewMode="rentedBy" />;
    }

    return (
        <div>
            <div className="secondary-tabs">
                <button className={activeSubTab === 'ownedBy' ? 'active' : ''} onClick={() => setActiveSubTab('ownedBy')}>Twoje oferty (wypożyczone)</button>
                <button className={activeSubTab === 'rentedBy' ? 'active' : ''} onClick={() => setActiveSubTab('rentedBy')}>Twoje wypożyczenia</button>
            </div>
            {activeSubTab === 'ownedBy' && <PaginatedRentalList username={username} viewMode="ownedBy" />}
            {activeSubTab === 'rentedBy' && <PaginatedRentalList username={username} viewMode="rentedBy" />}
        </div>
    );
};

export default ProfileRentalsTab;