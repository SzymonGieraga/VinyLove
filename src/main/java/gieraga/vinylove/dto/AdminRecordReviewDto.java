package gieraga.vinylove.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminRecordReviewDto {
    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private String authorUsername;
    private Long offerId;
    private String offerTitle;
}