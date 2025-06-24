import api from './api';

const getUserProfile = (username) => {
    return api.get(`/users/${username}/profile`);
};

const getProfileReviews = (username, viewMode, reviewType, page = 0) => {
    return api.get(`/users/${username}/reviews`, {
        params: { viewMode, reviewType, page, size: 6 }
    });
};

const getMyAddresses = () => {
    return api.get('/users/my-addresses');
};


const updateUserProfile = (formData) => {
    return api.put('/users/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const userService = {
    getUserProfile,
    getProfileReviews,
    updateUserProfile,
    getMyAddresses
};

export default userService;