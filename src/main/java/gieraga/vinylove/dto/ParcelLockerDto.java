package gieraga.vinylove.dto;

import lombok.Data;

@Data
public class ParcelLockerDto {
    private Long id;
    private String name;
    private String address;
    private Double lat;
    private Double lng;
}