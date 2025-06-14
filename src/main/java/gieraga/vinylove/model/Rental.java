package gieraga.vinylove.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Użytkownik, który wypożycza płytę
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renter_id", nullable = false)
    private User renter;

    // Oferta, której dotyczy wypożyczenie
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_offer_id", nullable = false)
    private RecordOffer recordOffer;

    @Column(nullable = false)
    private LocalDate rentalDate; // Data rozpoczęcia wypożyczenia

    @Column(nullable = false)
    private LocalDate returnDate; // Przewidywana data zwrotu

    @Column(nullable = false)
    private String deliveryAddress;

    @Column(nullable = false)
    private String deliveryMethod;
}