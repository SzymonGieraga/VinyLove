package gieraga.vinylove.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferDto {
    private Long id;
    private String title;
    private String artists;
    private String coverImageUrl;
    private Double averageRating;
    private int reviewCount;
}