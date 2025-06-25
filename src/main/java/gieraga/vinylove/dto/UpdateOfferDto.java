package gieraga.vinylove.dto;

import gieraga.vinylove.model.OfferStatus;
import lombok.Data;

@Data
public class UpdateOfferDto {
    private String title;
    private String artists;
    private String description;
    private OfferStatus status;
}