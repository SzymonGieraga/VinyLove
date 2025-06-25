import api from './api';

const getNotificationStatus = () => {
    return api.get('/notifications/status');
};


const getNotifications = (page = 0, size = 10) => {
    return api.get('/notifications', { params: { page, size } });
};

const markAllAsRead = () => {
    return api.put('/notifications/mark-all-as-read');
};

const notificationService = {
    getNotificationStatus,
    getNotifications,    
    markAllAsRead,
};


export default notificationService;