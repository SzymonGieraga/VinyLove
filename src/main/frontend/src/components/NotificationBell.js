import React, {useState, useEffect, useRef} from 'react';
import notificationService from '../services/notificationService';
import NotificationDropdown from './NotificationDropdown';

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="bell-icon">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);
const NotificationBell = () => {
    const [hasUnread, setHasUnread] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const bellRef = useRef(null);

    const checkStatus = async () => {
        try {
            const response = await notificationService.getNotificationStatus();
            setHasUnread(response.data.unreadCount > 0);
        } catch (error) {
            console.error("Błąd sprawdzania powiadomień:", error);
        }
    };

    useEffect(() => {
        checkStatus();
        const intervalId = setInterval(checkStatus, 30000);
        return () => clearInterval(intervalId);
    }, []);

    // Efekt do obsługi kliknięć na zewnątrz komponentu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bellRef.current && !bellRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [bellRef]);

    const handleBellClick = () => {
        const newOpenState = !isDropdownOpen;
        setIsDropdownOpen(newOpenState);

        if (newOpenState && hasUnread) {
            notificationService.markAllAsRead()
                .then(() => {
                    setHasUnread(false);
                })
                .catch(err => console.error("Błąd oznaczania powiadomień jako przeczytane", err));
        }
    };

    const containerClass = `notification-bell-container ${hasUnread ? 'has-unread' : ''}`;

    return (
        <div ref={bellRef} className={containerClass} onClick={handleBellClick}>
            <BellIcon />
            {hasUnread && <div className="notification-badge"></div>}

            {isDropdownOpen && <NotificationDropdown />}
        </div>
    );
};

export default NotificationBell;