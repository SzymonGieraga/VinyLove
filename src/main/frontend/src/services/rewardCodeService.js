import api from './api';

const getStatus = () => {
    return api.get('/reward-codes/status');
};

const generateCode = () => {
    return api.post('/reward-codes/generate');
};

const useCode = (codeId) => {
    return api.put(`/reward-codes/${codeId}/use`);
};

const getMyCodes = () => {
    return api.get('/reward-codes/my-codes');
};

const rewardCodeService = {
    getStatus,
    generateCode,
    useCode,
    getMyCodes,
};

export default rewardCodeService;