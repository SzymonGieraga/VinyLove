package gieraga.vinylove.service;

import gieraga.vinylove.converter.OfferConverter;
import gieraga.vinylove.dto.AddressDto;
import gieraga.vinylove.dto.CreateOfferDto;
import gieraga.vinylove.dto.OfferDetailsDto;
import gieraga.vinylove.dto.OfferDto;
import gieraga.vinylove.model.Address;
import gieraga.vinylove.model.OfferStatus;
import gieraga.vinylove.model.RecordOffer;
import gieraga.vinylove.model.User;
import gieraga.vinylove.repo.AddressRepo;
import gieraga.vinylove.repo.RecordOfferRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final RecordOfferRepo recordOfferRepo;
    private final OfferConverter offerConverter;
    private final AddressRepo addressRepo;

    private final FileStorageService fileStorageService;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public Page<OfferDto> getAvailableOffers(Pageable pageable) {
        Page<RecordOffer> offersPage = recordOfferRepo.findByStatus(OfferStatus.AVAILABLE, pageable);
        return offersPage.map(offerConverter::toDto);
    }

    @Transactional
    public OfferDetailsDto createOffer(CreateOfferDto dto, MultipartFile coverImage, MultipartFile audioSample) {
        User owner = authService.getAuthenticatedUser();
        if (owner == null) {
            throw new IllegalStateException("Użytkownik nie jest zalogowany.");
        }

        String coverImageUrl = fileStorageService.store(coverImage);
        String audioSampleUrl = fileStorageService.store(audioSample);

        AddressDto addressDto = dto.getReturnAddress();
        Address returnAddress;

        if (addressDto.getId() != null) {
            returnAddress = addressRepo.findById(addressDto.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Wybrany adres nie istnieje."));

            if (!returnAddress.getUser().getId().equals(owner.getId())) {
                throw new AccessDeniedException("Próba użycia nieautoryzowanego adresu.");
            }
        } else {
            returnAddress = new Address();
            returnAddress.setUser(owner);
            returnAddress.setType(addressDto.getType());
            returnAddress.setStreet(addressDto.getStreet());
            returnAddress.setCity(addressDto.getCity());
            returnAddress.setPostalCode(addressDto.getPostalCode());
            returnAddress.setCountry(addressDto.getCountry());
        }

        RecordOffer offer = new RecordOffer();
        offer.setOwner(owner);
        offer.setReturnAddress(returnAddress);
        offer.setTitle(dto.getTitle());
        offer.setArtists(dto.getArtists());
        offer.setDescription(dto.getDescription());
        offer.setCoverImageUrl(coverImageUrl);
        offer.setAudioSampleUrl(audioSampleUrl);
        offer.setStatus(OfferStatus.AVAILABLE);

        RecordOffer savedOffer = recordOfferRepo.save(offer);
        return offerConverter.toDetailsDto(savedOffer);
    }

    @Transactional(readOnly = true)
    public OfferDetailsDto getOfferById(Long id) {
        RecordOffer offer = recordOfferRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nie znaleziono oferty o ID: " + id));
        return offerConverter.toDetailsDto(offer);
    }

    @Transactional(readOnly = true)
    public Page<OfferDto> getAvailableOffers(String query, Pageable pageable) {
        Page<RecordOffer> offersPage;
        if (query != null && !query.isBlank()) {
            offersPage = recordOfferRepo.searchAvailableOffers(OfferStatus.AVAILABLE, query, pageable);
        } else {
            offersPage = recordOfferRepo.findByStatus(OfferStatus.AVAILABLE, pageable);
        }
        return offersPage.map(offerConverter::toDto);
    }

}
