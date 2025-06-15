import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import offerService from '../services/offerService';

const AddOfferPage = () => {
    const [title, setTitle] = useState('');
    const [artists, setArtists] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [audioSample, setAudioSample] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e, setFile) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const formData = new FormData();
        const offerData = { title, artists, description };

        // Dane tekstowe muszą być wysłane jako 'Blob' z typem JSON
        formData.append('offer', new Blob([JSON.stringify(offerData)], { type: 'application/json' }));

        if (coverImage) {
            formData.append('coverImage', coverImage);
        }
        if (audioSample) {
            formData.append('audioSample', audioSample);
        }

        try {
            await offerService.createOffer(formData);
            setMessage('Oferta została pomyślnie dodana!');
            setTimeout(() => navigate('/'), 2000); // Przekieruj na stronę główną
        } catch (error) {
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                'Wystąpił błąd podczas dodawania oferty.';
            setMessage(resMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Dodaj nową ofertę</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Tytuł albumu</label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="artists">Wykonawcy</label>
                    <input type="text" className="form-control" value={artists} onChange={(e) => setArtists(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Opis (opcjonalnie)</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="coverImage">Zdjęcie okładki (opcjonalnie)</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => handleFileChange(e, setCoverImage)} />
                </div>
                <div className="form-group">
                    <label htmlFor="audioSample">Próbka audio (opcjonalnie)</label>
                    <input type="file" className="form-control" accept="audio/*" onChange={(e) => handleFileChange(e, setAudioSample)} />
                </div>
                <div className="form-group">
                    <button className="button is-primary" disabled={loading}>
                        {loading ? 'Dodawanie...' : 'Dodaj ofertę'}
                    </button>
                </div>
                {message && <div className="alert alert-info">{message}</div>}
            </form>
        </div>
    );
};

export default AddOfferPage;