package gieraga.vinylove.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SimpleReviewDto {
    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    // Pola do identyfikacji recenzji
    private String reviewType; // "RECORD" lub "USER"
    private String subjectName; // Tytuł albumu lub nazwa ocenionego użytkownika
    private String reviewerUsername; // Kto napisał recenzję
}