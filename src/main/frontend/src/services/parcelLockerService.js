import api from './api';

const getLockers = () => {
    return api.get('/parcel-lockers');
};

const createLocker = (lockerData) => {
    return api.post('/parcel-lockers', lockerData);
};

const parcelLockerService = {
    getLockers,
    createLocker,
};

export default parcelLockerService;