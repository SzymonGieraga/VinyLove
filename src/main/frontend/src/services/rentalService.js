import api from './api';

const createRental = (rentalData) => {
    return api.post('/rentals', rentalData);
};

const rentalService = {
    createRental,
};

export default rentalService;