package gieraga.vinylove.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
public class UserReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private int rating;

    private String comment;

    private LocalDateTime createdAt;

    // Użytkownik wystawiający ocenę
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    // Użytkownik, który jest oceniany
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_user_id", nullable = false)
    private User reviewedUser;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}