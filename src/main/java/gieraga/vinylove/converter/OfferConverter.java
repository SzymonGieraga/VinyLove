package gieraga.vinylove.converter;

import gieraga.vinylove.dto.OfferDto;

import gieraga.vinylove.dto.UserOfferDto;
import gieraga.vinylove.model.RecordOffer;
import gieraga.vinylove.dto.OfferDetailsDto;
import org.springframework.stereotype.Component;

@Component
public class OfferConverter {
    public OfferDto toDto(RecordOffer entity) {
        if (entity == null) {
            return null;
        }
        return new OfferDto(
                entity.getId(),
                entity.getTitle(),
                entity.getArtists(),
                entity.getCoverImageUrl()
        );
    }
    public OfferDetailsDto toDetailsDto(RecordOffer entity) {
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
}