import api from './api';

const getOffers = (page = 0, size = 9) => {
    return api.get('/offers', {
        params: {
            page: page,
            size: size,
            sort: 'id,desc'
        }
    });
};

const createOffer = (formData) => {
    return api.post('/offers', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const getOfferDetails = (id) => {
    return api.get(`/offers/${id}`);
};

const offerService = {
    getOffers,
    createOffer,
    getOfferDetails,
};

export default offerService;
