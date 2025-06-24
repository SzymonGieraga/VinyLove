package gieraga.vinylove.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class ReviewDto {
    private String authorUsername;
    private String authorProfileImageUrl;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private boolean hasRented;
}