import api from './api';
import { jwtDecode } from 'jwt-decode';

const API_URL = '/auth/';

const register = (username, email, password) => {
    return api.post(API_URL + 'register', {
        username,
        email,
        password,
    });
};

const login = async (username, password) => {
    const response = await api.post(API_URL + 'login', {
        username,
        password,
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        return null;
    }

    const user = JSON.parse(userStr);
    try {
        const decodedToken = jwtDecode(user.token.replace("Bearer ", ""));

        if (decodedToken.exp * 1000 < Date.now()) {
            logout();
            return null;
        }
    } catch (e) {
        console.error("Błąd dekodowania tokenu", e);
        logout();
        return null;
    }


    return user;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;