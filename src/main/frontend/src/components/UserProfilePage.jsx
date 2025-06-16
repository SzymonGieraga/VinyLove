import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/userService';
import authService from '../services/authService';
import UserOffersTab from './UserOffersTab';

const UserProfilePage = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewsData, setReviewsData] = useState([]);
    const [activeTab, setActiveTab] = useState('offers');
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setIsOwner(currentUser && currentUser.username === username);

        setLoading(true);
        Promise.all([
            userService.getUserProfile(username),
        ]).then(([profileResponse]) => {
            setProfileData(profileResponse.data);
            setLoading(false);
        }).catch(error => {
            console.error("Błąd ładowania danych profilu:", error);
            setLoading(false);
        });

    }, [username]);

    if (loading) return <p className="text-center">Ładowanie profilu...</p>;
    if (!profileData) return <p className="text-center">Nie znaleziono użytkownika.</p>;

    const { description, profileImageUrl, offers } = profileData;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <img src={profileImageUrl || 'https://placehold.co/150x150/3273dc/ffffff?text=U'} alt={username} className="profile-avatar" />
                <div className="profile-info">
                    <h1>{username}</h1>
                    <p>{description || "Ten użytkownik nie dodał jeszcze opisu."}</p>
                </div>
            </header>

            <div className="profile-tabs">
                <button className={`tab-button ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>Oferty ({offers.length})</button>
                <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Recenzje</button>
                <button className={`tab-button ${activeTab === 'rentals' ? 'active' : ''}`} onClick={() => setActiveTab('rentals')}>Wypożyczenia</button>
            </div>

            <main className="profile-content">
                {activeTab === 'offers' && <UserOffersTab offers={offers} isOwner={isOwner} />}
                {activeTab === 'reviews' && <p>Zakładka z recenzjami w budowie.</p>}
                {activeTab === 'rentals' && <p>Zakładka z wypożyczeniami w budowie.</p>}
            </main>
        </div>
    );
};

export default UserProfilePage;
