package gieraga.vinylove.dto;

import gieraga.vinylove.model.RentalStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RentalDto {
    private Long rentalId;
    private Long offerId;
    private String offerTitle;
    private String offerImageUrl;
    private RentalStatus status;
    private LocalDate rentalDate;
    private LocalDate returnDate;
    private String otherPartyUsername;
}