import api from './api';

const getUserProfile = (username) => {
    return api.get(`/users/${username}/profile`);
};

const getProfileReviews = (username, viewMode, reviewType, page = 0) => {
    return api.get(`/users/${username}/reviews`, {
        params: { viewMode, reviewType, page, size: 6 }
    });
};

const userService = { getUserProfile, getProfileReviews };
export default userService;