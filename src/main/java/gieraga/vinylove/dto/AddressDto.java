package gieraga.vinylove.dto;

import gieraga.vinylove.model.AddressType;
import lombok.Data;

@Data
public class AddressDto {
    private AddressType type;
    private String street;
    private String city;
    private String postalCode;
    private String country;
}