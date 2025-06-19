package gieraga.vinylove.dto;

import lombok.Data;

@Data
public class RentalRequestDto {
    private Long offerId;
    private int rentalDays;
    private AddressDto deliveryAddress;
}