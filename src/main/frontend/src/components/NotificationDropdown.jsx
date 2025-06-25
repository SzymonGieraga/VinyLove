import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import notificationService from '../services/notificationService';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        notificationService.getNotifications(0, 10)
            .then(response => {
                setNotifications(response.data.content);
            })
            .catch(error => console.error("Błąd pobierania listy powiadomień:", error))
            .finally(() => setLoading(false));
    }, []);

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " lat temu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " mies. temu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " dni temu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " godz. temu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " min. temu";
        return "Przed chwilą";
    };

    const generateLink = (notification) => {
        switch (notification.type) {
            case 'NEW_RENTAL':
            case 'OFFER_REVIEW':
                return `/offer/${notification.linkId}`;
            case 'USER_REVIEW':
                return `/my-profile`;
            case 'RENTAL_REMINDER':
                return { pathname: '/my-profile', state: { defaultTab: 'rentals' } };
            default:
                return '#';
        }
    };

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <h4>Powiadomienia</h4>
            </div>
            <div className="notification-list">
                {loading ? (
                    <p className="notification-item-info">Ładowanie...</p>
                ) : notifications.length === 0 ? (
                    <p className="notification-item-info">Brak nowych powiadomień.</p>
                ) : (
                    notifications.map(notif => (
                        <Link to={generateLink(notif)} key={notif.id} className="notification-link">
                            <div className="notification-item">
                                <p className="notification-message">{notif.message}</p>
                                <span className="notification-date">{formatTimeAgo(notif.createdAt)}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;