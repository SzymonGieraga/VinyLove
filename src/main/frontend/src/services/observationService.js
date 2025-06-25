import api from './api';

const observeOffer = (offerId) => {
    return api.post(`/observe/${offerId}`);
};

const unobserveOffer = (offerId) => {
    return api.delete(`/observe/${offerId}`);
};

const observationService = {
    observeOffer,
    unobserveOffer,
};

export default observationService;