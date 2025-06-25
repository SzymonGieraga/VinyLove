import api from './api';

const getOffers = (query = '', page = 0, size = 9) => {
    return api.get('/offers', { params: { query, page, size, sort: 'id,desc' } });
};

const createOffer = (formData) => {
    return api.post('/offers', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

const getOfferDetails = (id) => {
    return api.get(`/offers/${id}`);
};

const getReviewsForOffer = (offerId) => {
    return api.get(`/offers/${offerId}/reviews`);
};

const addReviewForOffer = (offerId, reviewData) => {
    return api.post(`/offers/${offerId}/reviews`, reviewData);
};

const updateOffer = (offerId, formData) => {
    return api.put(`/offers/${offerId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const offerService = {
    getOffers,
    createOffer,
    getOfferDetails,
    getReviewsForOffer,
    addReviewForOffer,
    updateOffer
};

export default offerService;