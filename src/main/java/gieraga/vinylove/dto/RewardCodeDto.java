package gieraga.vinylove.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RewardCodeDto {
    private Long id;
    private String code;
    private Integer discountPercentage;
    private boolean isUsed;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}