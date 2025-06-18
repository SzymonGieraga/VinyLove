import api from './api';

const deleteRecordReview = (id) => {
    return api.delete(`/reviews/record/${id}`);
};

const deleteUserReview = (id) => {
    return api.delete(`/reviews/user/${id}`);
};

const addUserReview = (username, reviewData) => {
    return api.post(`/users/${username}/reviews`, reviewData);
};

const reviewService = {
    deleteRecordReview,
    deleteUserReview,
    addUserReview,
};
export default reviewService;