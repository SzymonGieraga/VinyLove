package gieraga.vinylove.converter;

import gieraga.vinylove.dto.AdminOfferDto;
import gieraga.vinylove.dto.OfferDto;

import gieraga.vinylove.dto.UserOfferDto;
import gieraga.vinylove.model.RecordOffer;
import gieraga.vinylove.dto.OfferDetailsDto;
import gieraga.vinylove.model.RecordReview;
import gieraga.vinylove.model.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OfferConverter {
    public OfferDto toDto(RecordOffer entity) {
        if (entity == null) {
            return null;
        }
        OfferDto dto = new OfferDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setArtists(entity.getArtists());
        dto.setCoverImageUrl(entity.getCoverImageUrl());

        List<RecordReview> reviews = entity.getReviews();
        if (reviews != null && !reviews.isEmpty()) {
            double average = reviews.stream()
                    .mapToInt(RecordReview::getRating)
                    .average()
                    .orElse(0.0);
            dto.setAverageRating(average);
            dto.setReviewCount(reviews.size());
        } else {
            dto.setAverageRating(0.0);
            dto.setReviewCount(0);
        }

        return dto;
    }
    public OfferDetailsDto toDetailsDto(RecordOffer entity, boolean isObserved) {
        if (entity == null) {
            return null;
        }
        OfferDetailsDto dto = new OfferDetailsDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setArtists(entity.getArtists());
        dto.setDescription(entity.getDescription());
        dto.setCoverImageUrl(entity.getCoverImageUrl());
        dto.setAudioSampleUrl(entity.getAudioSampleUrl());

        if (entity.getOwner() != null) {
            dto.setOwnerUsername(entity.getOwner().getUsername());
            dto.setOwnerProfileImageUrl(entity.getOwner().getProfileImageUrl());
        }

        List<RecordReview> reviews = entity.getReviews();
        if (reviews != null && !reviews.isEmpty()) {
            double average = reviews.stream()
                    .mapToInt(RecordReview::getRating)
                    .average()
                    .orElse(0.0);
            dto.setAverageRating(average);
            dto.setReviewCount(reviews.size());
        } else {
            dto.setAverageRating(0.0);
            dto.setReviewCount(0);
        }

        dto.setObserved(isObserved);
        return dto;
    }

    public UserOfferDto toUserOfferDto(RecordOffer entity) {
        if (entity == null) return null;
        UserOfferDto dto = new UserOfferDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setArtists(entity.getArtists());
        dto.setCoverImageUrl(entity.getCoverImageUrl());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    public AdminOfferDto toAdminDto(RecordOffer offer) {
        AdminOfferDto dto = new AdminOfferDto();
        dto.setId(offer.getId());
        dto.setTitle(offer.getTitle());
        dto.setArtists(offer.getArtists());
        dto.setStatus(offer.getStatus());
        dto.setOwnerUsername(offer.getOwner().getUsername());
        return dto;
    }
}