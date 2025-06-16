package gieraga.vinylove.dto;

import lombok.Data;

@Data
public class CreateOfferDto {
    private String title;
    private String artists;
    private String description;
    private AddressDto returnAddress;
}