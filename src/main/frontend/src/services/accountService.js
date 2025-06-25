import api from './api';
import authService from "./authService";

const fundAccount = (amount) => {
    return api.post('/account/fund', { amount });
};

const updateLocalUserBalance = (newBalance) => {
    const user = authService.getCurrentUser();
    if (user) {
        user.balance = newBalance;
        localStorage.setItem('user', JSON.stringify(user));
    }
};


const accountService = {
    fundAccount,
    updateLocalUserBalance
};

export default accountService;