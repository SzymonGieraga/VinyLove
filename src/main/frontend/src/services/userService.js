import api from './api';

const getUserProfile = (username) => {
    return api.get(`/users/${username}/profile`);
};

const userService = {
    getUserProfile,
};

export default userService;