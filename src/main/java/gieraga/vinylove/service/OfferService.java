package gieraga.vinylove.service;

import gieraga.vinylove.converter.OfferConverter;
import gieraga.vinylove.dto.*;
import gieraga.vinylove.model.*;
import gieraga.vinylove.repo.AddressRepo;
import gieraga.vinylove.repo.RecordOfferRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import gieraga.vinylove.repo.UserRepo;

import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final RecordOfferRepo recordOfferRepo;
    private final OfferConverter offerConverter;
    private final AddressRepo addressRepo;
    private final UserRepo userRepo;

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
        return offerConverter.toDetailsDto(savedOffer, false);
    }

    @Transactional(readOnly = true)
    public OfferDetailsDto getOfferDetails(Long id) {
        RecordOffer offer = recordOfferRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nie znaleziono oferty o ID: " + id));

        User currentUser = authService.getOptionalAuthenticatedUser().orElse(null);

        boolean isObserved = false;
        if (currentUser != null) {
            isObserved = userRepo.isObservingOffer(currentUser.getUsername(), id);
        }

        return offerConverter.toDetailsDto(offer, isObserved);
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

    @Transactional
    public OfferDetailsDto updateOffer(Long offerId, UpdateOfferDto dto, MultipartFile coverImage, MultipartFile audioSample) {
        User currentUser = authService.getAuthenticatedUser();
        RecordOffer offer = recordOfferRepo.findById(offerId)
                .orElseThrow(() -> new EntityNotFoundException("Nie znaleziono oferty o ID: " + offerId));

        boolean isOwner = offer.getOwner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == UserRole.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Nie masz uprawnień do edycji tej oferty.");
        }

        if (dto.getTitle() != null) {
            offer.setTitle(dto.getTitle());
        }
        if (dto.getArtists() != null) {
            offer.setArtists(dto.getArtists());
        }
        if (dto.getDescription() != null) {
            offer.setDescription(dto.getDescription());
        }
        if (dto.getStatus() != null) {
            if (offer.getStatus() == OfferStatus.RENTED && dto.getStatus() != OfferStatus.RENTED) {
                throw new IllegalStateException("Nie można zmienić statusu oferty, która jest aktualnie wypożyczona.");
            }
            offer.setStatus(dto.getStatus());
        }

        if (coverImage != null && !coverImage.isEmpty()) {
            if (offer.getCoverImageUrl() != null) {
                fileStorageService.delete(offer.getCoverImageUrl());
            }
            String newCoverImageUrl = fileStorageService.store(coverImage);
            offer.setCoverImageUrl(newCoverImageUrl);
        }
        if (audioSample != null && !audioSample.isEmpty()) {
            if (offer.getAudioSampleUrl() != null) {
                fileStorageService.delete(offer.getAudioSampleUrl());
            }
            String newAudioSampleUrl = fileStorageService.store(audioSample);
            offer.setAudioSampleUrl(newAudioSampleUrl);
        }

        RecordOffer updatedOffer = recordOfferRepo.save(offer);
        boolean isObserved = userRepo.isObservingOffer(currentUser.getUsername(), offerId);

        return offerConverter.toDetailsDto(updatedOffer, isObserved);
    }


}
