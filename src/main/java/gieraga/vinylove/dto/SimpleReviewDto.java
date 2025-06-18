package gieraga.vinylove.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SimpleReviewDto {
    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    private String reviewType;
    private String reviewerUsername;
    private String reviewerProfileImageUrl;

    private Long subjectId;
    private String subjectName;
    private String subjectImageUrl;
}