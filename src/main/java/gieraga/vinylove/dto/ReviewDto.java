package gieraga.vinylove.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private String authorUsername;
    private String authorProfileImageUrl;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private boolean hasRented;
}