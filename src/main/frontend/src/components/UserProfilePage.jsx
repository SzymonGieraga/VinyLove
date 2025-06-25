import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import userService from '../services/userService';
import authService from '../services/authService';
import UserOffersTab from './UserOffersTab';
import ProfileReviewsTab from './ProfileReviewsTab';
import UserActionModal from './UserActionModal';
import UserReviewForm from "./UserReviewForm";
import EditProfileForm from './EditProfileForm';
import ProfileRentalsTab from "./ProfileRentalTab";
import SavedOffersTab from './SavedOffersTab';
import RewardCodesTab from './RewardCodesTab';


const UserProfilePage = () => {
    const { username } = useParams();
    const location = useLocation();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [activeTab, setActiveTab] = useState(location.state?.defaultTab || 'offers');

    const fetchProfileData = useCallback(() => {
        setLoading(true);
        userService.getUserProfile(username)
            .then(response => {
                setProfileData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Błąd ładowania danych profilu:", error);
                setLoading(false);
            });
    }, [username]);

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        setIsOwner(user && user.username === username);
        fetchProfileData();
    }, [username, fetchProfileData]);

    if (loading) return <p className="text-center">Ładowanie profilu...</p>;
    if (!profileData) return <p className="text-center">Nie znaleziono użytkownika.</p>;

    const { description, profileImageUrl, offers } = profileData;

    return (
        <>
            <UserActionModal
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                title={isOwner ? "Edytuj profil" : `Oceń użytkownika ${username}`}
            >
                {isOwner ? (
                    <EditProfileForm
                        currentUserProfile={profileData}
                        onSuccess={() => {
                            setIsActionModalOpen(false);
                            fetchProfileData();
                        }}
                    />
                ) : (
                    <UserReviewForm
                        reviewedUsername={username}
                        onSuccess={() => {
                            setIsActionModalOpen(false);
                            alert("Dziękujemy za Twoją opinię!");
                        }}
                    />
                )}
            </UserActionModal>

            <div className="profile-container">
                <header className="profile-header">
                    <img src={profileImageUrl || 'https://placehold.co/150x150/3273dc/ffffff?text=U'} alt={username} className="profile-avatar" />
                    <div className="profile-info">
                        <h1>{username}</h1>
                        <p>{description || "Ten użytkownik nie dodał jeszcze opisu."}</p>
                    </div>
                    <div className="profile-actions">
                        {isOwner ? (
                            <button className="button" onClick={() => setIsActionModalOpen(true)}>Edytuj profil</button>
                        ) : (
                            currentUser && <button className="button is-primary" onClick={() => setIsActionModalOpen(true)}>Zostaw recenzję</button>
                        )}
                    </div>
                </header>

                <div className="profile-tabs">
                    <button className={`tab-button ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>Oferty</button>
                    <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Recenzje</button>
                    <button className={`tab-button ${activeTab === 'rentals' ? 'active' : ''}`} onClick={() => setActiveTab('rentals')}>Wypożyczenia</button>
                    {isOwner && (
                        <button className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Zapisane</button>
                    )}
                    {isOwner && (
                        <button className={`tab-button ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => setActiveTab('rewards')}>Kody Rabatowe</button>
                    )}
                </div>

                <main className="profile-content">
                    {activeTab === 'offers' && (
                        <UserOffersTab
                            offers={offers}
                            isOwner={isOwner}
                            onOfferUpdated={fetchProfileData}
                        />
                    )}
                    {activeTab === 'reviews' && (
                        <ProfileReviewsTab
                            username={username}
                            isOwner={isOwner}
                            onReviewDeleted={fetchProfileData}
                        />
                    )}
                    {activeTab === 'rentals' && <ProfileRentalsTab username={username} isOwner={isOwner} />}
                    {activeTab === 'saved' && isOwner && <SavedOffersTab />}
                    {activeTab === 'rewards' && isOwner && <RewardCodesTab />}

                </main>
            </div>
        </>
    );
};

export default UserProfilePage;