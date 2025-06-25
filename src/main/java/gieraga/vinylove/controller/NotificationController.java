package gieraga.vinylove.controller;

import gieraga.vinylove.dto.NotificationDto;
import gieraga.vinylove.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Long>> getNotificationStatus() {
        long unreadCount = notificationService.getUnreadNotificationCountForCurrentUser();
        return ResponseEntity.ok(Map.of("unreadCount", unreadCount));
    }

    @GetMapping
    public ResponseEntity<Page<NotificationDto>> getUserNotifications(@PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<NotificationDto> notifications = notificationService.getNotificationsForCurrentUser(pageable);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/mark-all-as-read")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsReadForCurrentUser();
        return ResponseEntity.noContent().build();
    }
}