import React, {useCallback, useEffect, useState} from 'react';
import OfferReviewManagementTab from './OfferReviewManagementTab';
import UserReviewManagementTab from './UserReviewManagementTab';
import OfferManagementTab from "./OfferManagmentTab";
import adminService from "../services/adminService";
import ParcelLockerMap from './ParcelLockerMap';

const UserManagementTab = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback((pageNum) => {
        setLoading(true);
        adminService.getUsers(pageNum)
            .then(response => {
                setUsers(response.data.content);
                setPage(response.data.number);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => console.error("Błąd pobierania użytkowników:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchUsers(0);
    }, [fetchUsers]);

    const handleToggleStatus = (userId) => {
        adminService.toggleUserStatus(userId)
            .then(() => {
                alert("Status użytkownika został zmieniony.");
                fetchUsers(page); // Odśwież listę
            })
            .catch(() => alert("Wystąpił błąd."));
    };


    if (loading) return <p>Ładowanie użytkowników...</p>;

    return (
        <div>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nazwa użytkownika</th>
                    <th>Email</th>
                    <th>Rola</th>
                    <th>Status</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                                <span className={`status-badge ${user.active ? 'status-available' : 'status-archived'}`}>
                                    {user.active ? 'Aktywny' : 'Nieaktywny'}
                                </span>
                        </td>
                        <td>
                            <button
                                onClick={() => handleToggleStatus(user.id)}
                                className={`button is-small ${user.active ? 'is-danger' : 'is-success'}`}
                            >
                                {user.active ? 'Dezaktywuj' : 'Aktywuj'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('users');

    const ParcelLockerManagementTab = () => (
        <div>
            <h3>Zarządzanie paczkomatami</h3>
            <p>Kliknij na mapie, aby dodać nowy paczkomat.</p>
            <div style={{marginTop: '1rem'}}>

                <ParcelLockerMap isAdmin={true} />
            </div>
        </div>
    );


    return (
        <div className="container">
            <header className="jumbotron">
                <h2>Panel Administratora</h2>
                <p>Witaj w panelu zarządzania.</p>
            </header>

            <div className="profile-tabs">
                <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Użytkownicy</button>
                <button className={`tab-button ${activeTab === 'offer-reviews' ? 'active' : ''}`} onClick={() => setActiveTab('offer-reviews')}>Recenzje Ofert</button>
                <button className={`tab-button ${activeTab === 'user-reviews' ? 'active' : ''}`} onClick={() => setActiveTab('user-reviews')}>Recenzje Użytkowników</button>
                <button className={`tab-button ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>Oferty</button>
                <button className={`tab-button ${activeTab === 'parcel-lockers' ? 'active' : ''}`} onClick={() => setActiveTab('parcel-lockers')}>Paczkomaty</button>
            </div>

            <main className="profile-content">
                {activeTab === 'users' && <UserManagementTab />}
                {activeTab === 'offer-reviews' && <OfferReviewManagementTab />}
                {activeTab === 'user-reviews' && <UserReviewManagementTab />}
                {activeTab === 'offers' && <OfferManagementTab />}
                {activeTab === 'parcel-lockers' && <ParcelLockerManagementTab />}
            </main>
        </div>
    );
};

export default AdminPage;