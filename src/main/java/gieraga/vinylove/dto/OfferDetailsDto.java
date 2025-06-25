package gieraga.vinylove.dto;

import lombok.Data;

@Data
public class OfferDetailsDto {
    private Long id;
    private String title;
    private String artists;
    private String description;
    private String coverImageUrl;
    private String audioSampleUrl;
    private String ownerUsername;
    private String ownerProfileImageUrl;
    private Double averageRating;
    private int reviewCount;
    private boolean isObserved;
}