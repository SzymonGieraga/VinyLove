import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import offerService from '../services/offerService';
import AddressSelection from './AddressSelection';

const AddOfferPage = () => {
    const [title, setTitle] = useState('');
    const [artists, setArtists] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [audioSample, setAudioSample] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [returnAddress, setReturnAddress] = useState({
        type: 'HOME',
        street: '',
        city: '',
        postalCode: '',
        country: 'Polska'
    });
    const navigate = useNavigate();

    const handleFileChange = (e, setFile) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        const offerData = { title, artists, description, returnAddress };
        formData.append('offer', new Blob([JSON.stringify(offerData)], { type: 'application/json' }));

        if (coverImage) formData.append('coverImage', coverImage);
        if (audioSample) formData.append('audioSample', audioSample);

        try {
            await offerService.createOffer(formData);
            navigate('/');
        } catch(error) {
            setMessage("Wystąpił błąd podczas dodawania oferty.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Dodano nową klasę, aby formularz był szerszy
        <div className="form-container add-offer-container">
            <h2>Dodaj nową ofertę</h2>
            <form onSubmit={handleSubmit}>
                {/* Nowy kontener dla układu dwukolumnowego */}
                <div className="add-offer-layout">
                    {/* Lewa kolumna: Dane oferty */}
                    <div className="offer-details-column">
                        <div className="form-group">
                            <label htmlFor="title">Tytuł albumu</label>
                            <input type="text" id="title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="artists">Wykonawcy</label>
                            <input type="text" id="artists" className="form-control" value={artists} onChange={(e) => setArtists(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Opis (opcjonalnie)</label>
                            <textarea id="description" className="form-control" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="coverImage">Zdjęcie okładki (opcjonalnie)</label>
                            <input type="file" id="coverImage" className="form-control" accept="image/*" onChange={(e) => handleFileChange(e, setCoverImage)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="audioSample">Próbka audio (opcjonalnie)</label>
                            <input type="file" id="audioSample" className="form-control" accept="audio/*" onChange={(e) => handleFileChange(e, setAudioSample)} />
                        </div>
                    </div>
                    {/* Prawa kolumna: Wybór adresu */}
                    <div className="address-column">
                        <div className="form-group">
                            <label>Adres do zwrotu płyty</label>
                            <AddressSelection address={returnAddress} setAddress={setReturnAddress} />
                        </div>
                    </div>
                </div>

                {/* Przycisk i wiadomości pod kolumnami */}
                <div className="form-group form-submit-group">
                    <button className="button is-primary" disabled={loading}>
                        {loading ? 'Dodawanie...' : 'Dodaj ofertę'}
                    </button>
                </div>
                {message && <div className="alert alert-info text-center">{message}</div>}
            </form>
        </div>
    );
};

export default AddOfferPage;
