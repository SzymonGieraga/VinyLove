package gieraga.vinylove.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminUserReviewDto {
    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private String reviewerUsername;
    private String reviewedUserUsername;
}