package gieraga.vinylove.converter;

import gieraga.vinylove.dto.AddressDto;
import gieraga.vinylove.model.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressConverter {

    public AddressDto toDto(Address address) {
        if (address == null) {
            return null;
        }

        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setType(address.getType());
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountry(address.getCountry());

        return dto;
    }
}