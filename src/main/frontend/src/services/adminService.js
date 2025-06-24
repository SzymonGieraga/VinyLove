import api from './api';

const getUsers = (page = 0, size = 10) => {
    return api.get('/admin/users', { params: { page, size } });
};

const toggleUserStatus = (userId) => {
    return api.put(`/admin/users/${userId}/toggle-status`);
};

const getOfferReviews = (page = 0, size = 10) => {
    return api.get('/admin/reviews/offers', { params: { page, size } });
};

const deleteOfferReview = (reviewId) => {
    return api.delete(`/admin/reviews/offers/${reviewId}`);
};

const getUserReviews = (page = 0, size = 10) => {
    return api.get('/admin/reviews/users', { params: { page, size } });
};

const deleteUserReview = (reviewId) => {
    return api.delete(`/admin/reviews/users/${reviewId}`);
};


const adminService = {
    getUsers,
    toggleUserStatus,
    getOfferReviews,
    deleteOfferReview,
    getUserReviews,
    deleteUserReview,
};

export default adminService;