package gieraga.vinylove.service;

import gieraga.vinylove.converter.OfferConverter;
import gieraga.vinylove.dto.CreateOfferDto;
import gieraga.vinylove.dto.OfferDetailsDto;
import gieraga.vinylove.dto.OfferDto;
import gieraga.vinylove.model.OfferStatus;
import gieraga.vinylove.model.RecordOffer;
import gieraga.vinylove.model.User;
import gieraga.vinylove.repo.RecordOfferRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final RecordOfferRepo recordOfferRepo;
    private final OfferConverter offerConverter;

    private final FileStorageService fileStorageService;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public Page<OfferDto> getAvailableOffers(Pageable pageable) {
        Page<RecordOffer> offersPage = recordOfferRepo.findByStatus(OfferStatus.AVAILABLE, pageable);
        return offersPage.map(offerConverter::toDto);
    }

    @Transactional
    public RecordOffer createOffer(CreateOfferDto dto, MultipartFile coverImage, MultipartFile audioSample) {
        User owner = authService.getAuthenticatedUser();
        if (owner == null) {
            throw new IllegalStateException("Nie znaleziono zalogowanego użytkownika.");
        }

        String coverImageUrl = fileStorageService.store(coverImage);
        String audioSampleUrl = fileStorageService.store(audioSample);

        RecordOffer offer = new RecordOffer();
        offer.setTitle(dto.getTitle());
        offer.setArtists(dto.getArtists());
        offer.setDescription(dto.getDescription());
        offer.setCoverImageUrl(coverImageUrl);
        offer.setAudioSampleUrl(audioSampleUrl);
        offer.setOwner(owner);
        offer.setStatus(OfferStatus.AVAILABLE);

        return recordOfferRepo.save(offer);
    }

    @Transactional(readOnly = true)
    public OfferDetailsDto getOfferById(Long id) {
        RecordOffer offer = recordOfferRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nie znaleziono oferty o ID: " + id));
        return offerConverter.toDetailsDto(offer);
    }

}
