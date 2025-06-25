package gieraga.vinylove.service;

import gieraga.vinylove.dto.NotificationDto;
import gieraga.vinylove.model.Notification;
import gieraga.vinylove.model.User;
import gieraga.vinylove.repo.NotificationRepo;
import gieraga.vinylove.repo.UserRepo;
import gieraga.vinylove.model.NotificationType;
import gieraga.vinylove.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepo notificationRepo;
    private final AuthService authService;

    @Transactional
    public void createNotification(User user, String message, NotificationType type, Long linkId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setType(type);
        notification.setLinkId(linkId);

        notificationRepo.save(notification);
    }

    @Transactional(readOnly = true)
    public long getUnreadNotificationCountForCurrentUser() {
        User currentUser = authService.getAuthenticatedUser();
        return notificationRepo.countByUserAndIsReadFalse(currentUser);
    }

    @Transactional(readOnly = true)
    public Page<NotificationDto> getNotificationsForCurrentUser(Pageable pageable) {
        User currentUser = authService.getAuthenticatedUser();
        return notificationRepo.findByUserOrderByCreatedAtDesc(currentUser, pageable)
                .map(this::toDto);
    }

    @Transactional
    public void markAllAsReadForCurrentUser() {
        User currentUser = authService.getAuthenticatedUser();
        notificationRepo.markAllAsReadForUser(currentUser);
    }

    private NotificationDto toDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setType(notification.getType());
        dto.setLinkId(notification.getLinkId());
        return dto;
    }
}