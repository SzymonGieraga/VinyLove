import api from './api';

const createRental = (rentalData) => {
    return api.post('/rentals', rentalData);
};

const getProfileRentals = (username, viewMode, page = 0) => {
    return api.get(`/users/${username}/rentals`, {
        params: { viewMode, page, size: 5 }
    });
};

const updateRentalStatus = (rentalId, newStatus) => {
    return api.put(`/rentals/${rentalId}/status`, `"${newStatus}"`); }

const rentalService = {
    createRental,
    getProfileRentals,
    updateRentalStatus,
};

export default rentalService;