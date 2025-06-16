package gieraga.vinylove.dto;

import gieraga.vinylove.model.OfferStatus;
import lombok.Data;

@Data
public class UserOfferDto {
    private Long id;
    private String title;
    private String artists;
    private String coverImageUrl;
    private OfferStatus status;
}