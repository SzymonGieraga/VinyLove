import React, { useState } from 'react';
import userService from '../services/userService';

const EditProfileForm = ({ currentUserProfile, onSuccess }) => {
    const [description, setDescription] = useState(currentUserProfile.description || '');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(currentUserProfile.profileImageUrl);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Utwórz podgląd
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('description', description);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            await userService.updateUserProfile(formData);
            onSuccess(); // Wywołaj funkcję zwrotną (odświeżenie profilu i zamknięcie modala)
        } catch (error) {
            setMessage('Wystąpił błąd podczas aktualizacji profilu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-group image-preview-group">
                <label>Podgląd zdjęcia profilowego</label>
                <img src={previewImage || 'https://placehold.co/150x150/3273dc/ffffff?text=U'} alt="Podgląd" className="profile-avatar-preview" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="description">Twój opis (bio)</label>
                <textarea
                    id="description"
                    className="form-control"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opowiedz coś o sobie..."
                ></textarea>
            </div>
            <button type="submit" className="button is-primary" disabled={loading}>
                {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
            {message && <p className="alert alert-danger" style={{marginTop: '1rem'}}>{message}</p>}
        </form>
    );
};

export default EditProfileForm;
