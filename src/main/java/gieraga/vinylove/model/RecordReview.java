package gieraga.vinylove.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class RecordReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private int rating; // Ocena w skali 1-5

    // Użytkownik, który wystawił recenzję
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    // Płyta, której dotyczy recenzja
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_offer_id", nullable = false)
    private RecordOffer recordOffer;
}