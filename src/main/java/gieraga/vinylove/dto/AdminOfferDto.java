package gieraga.vinylove.dto;

import gieraga.vinylove.model.OfferStatus;
import lombok.Data;

@Data
public class AdminOfferDto {
    private Long id;
    private String title;
    private String artists;
    private OfferStatus status;
    private String ownerUsername;
}