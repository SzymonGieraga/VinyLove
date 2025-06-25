import React, { useState, useEffect } from 'react';
import offerService from '../services/offerService';

const EditOfferModal = ({ isOpen, onClose, offer, onOfferUpdated }) => {
    const [formData, setFormData] = useState({
        title: '',
        artists: '',
        description: '',
        status: 'AVAILABLE',
    });
    const [coverImage, setCoverImage] = useState(null);
    const [audioSample, setAudioSample] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (offer) {
            setFormData({
                title: offer.title || '',
                artists: offer.artists || '',
                description: offer.description || '',
                status: offer.status || 'AVAILABLE',
            });
        }
    }, [offer]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleFileChange = (e) => {
        if (e.target.name === 'coverImage') {
            setCoverImage(e.target.files[0]);
        } else if (e.target.name === 'audioSample') {
            setAudioSample(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('data', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

        if (coverImage) {
            data.append('coverImage', coverImage);
        }
        if (audioSample) {
            data.append('audioSample', audioSample);
        }

        try {
            await offerService.updateOffer(offer.id, data);
            onOfferUpdated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił błąd podczas aktualizacji oferty.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <form onSubmit={handleSubmit}>
                    <h4>Edytuj Ofertę</h4>

                    <div className="form-group">
                        <label htmlFor="title">Tytuł</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="artists">Artysta</label>
                        <input type="text" id="artists" name="artists" value={formData.artists} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Opis</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-control" rows="4"></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-control" disabled={offer.status === 'RENTED'}>
                            <option value="AVAILABLE">Dostępna</option>
                            <option value="HIDDEN">Ukryta</option>
                            <option value="ARCHIVED">Zarchiwizowana</option>
                            {offer.status === 'RENTED' && <option value="RENTED">Wypożyczona (nie można zmienić)</option>}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="coverImage">Zmień okładkę (opcjonalnie)</label>
                        <input type="file" id="coverImage" name="coverImage" onChange={handleFileChange} className="form-control" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="audioSample">Zmień próbkę audio (opcjonalnie)</label>
                        <input type="file" id="audioSample" name="audioSample" onChange={handleFileChange} className="form-control" />
                    </div>

                    <button type="submit" className="button" disabled={loading}>
                        {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                    </button>
                    {error && <p className="alert alert-danger" style={{marginTop: '1rem'}}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default EditOfferModal;