package gieraga.vinylove.dto;

import gieraga.vinylove.model.NotificationType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private Long id;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
    private NotificationType type;
    private Long linkId;
}