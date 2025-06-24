package gieraga.vinylove.service;

import gieraga.vinylove.dto.AddressDto;
import gieraga.vinylove.dto.RentalDto;
import gieraga.vinylove.dto.RentalRequestDto;
import gieraga.vinylove.model.*;
import gieraga.vinylove.repo.AddressRepo;
import gieraga.vinylove.repo.RecordOfferRepo;
import gieraga.vinylove.repo.UserRepo;
import gieraga.vinylove.repo.RentalRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepo rentalRepo;
    private final RecordOfferRepo recordOfferRepo;
    private final AuthService authService;
    private final UserRepo userRepo;
    private final AddressRepo addressRepo;

    private static final BigDecimal RENTAL_DEPOSIT = new BigDecimal("50.00");

    @Transactional
    public RentalDto createRental(RentalRequestDto rentalRequestDto) {
        User renter = authService.getAuthenticatedUser();
        if (renter == null) {
            throw new IllegalStateException("Aby wypożyczyć, musisz być zalogowany.");
        }

        RecordOffer offer = recordOfferRepo.findById(rentalRequestDto.getOfferId())
                .orElseThrow(() -> new EntityNotFoundException("Nie znaleziono oferty o ID: " + rentalRequestDto.getOfferId()));

        if (offer.getStatus() != OfferStatus.AVAILABLE) {
            throw new IllegalStateException("Ta oferta jest aktualnie niedostępna.");
        }

        if (offer.getOwner().getId().equals(renter.getId())) {
            throw new IllegalStateException("Nie możesz wypożyczyć własnej płyty.");
        }

        if (renter.getBalance().compareTo(RENTAL_DEPOSIT) < 0) {
            throw new IllegalStateException("Niewystarczające środki na koncie. Wymagana kaucja: " + RENTAL_DEPOSIT + " PLN.");
        }

        renter.setBalance(renter.getBalance().subtract(RENTAL_DEPOSIT));
        userRepo.save(renter);

        offer.setStatus(OfferStatus.RENTED);
        recordOfferRepo.save(offer);

        AddressDto addressDto = rentalRequestDto.getDeliveryAddress();
        Address deliveryAddress;

        if (addressDto.getId() != null) {
            deliveryAddress = addressRepo.findById(addressDto.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Wybrany adres nie istnieje."));
            if (!deliveryAddress.getUser().equals(renter)) {
                throw new AccessDeniedException("Próba użycia nieautoryzowanego adresu.");
            }
        } else {
            deliveryAddress = new Address();
            deliveryAddress.setUser(renter);
            deliveryAddress.setType(addressDto.getType());
            deliveryAddress.setStreet(addressDto.getStreet());
            deliveryAddress.setCity(addressDto.getCity());
            deliveryAddress.setPostalCode(addressDto.getPostalCode());
            deliveryAddress.setCountry(addressDto.getCountry());
        }


        Rental rental = new Rental();
        rental.setRenter(renter);
        rental.setRecordOffer(offer);
        rental.setRentalDate(LocalDate.now());
        rental.setReturnDate(LocalDate.now().plusDays(rentalRequestDto.getRentalDays()));
        rental.setStatus(RentalStatus.REQUESTED);
        rental.setDeliveryAddress(deliveryAddress);

        Rental savedRental = rentalRepo.save(rental);

        return mapToDto(savedRental);
    }

    @Transactional(readOnly = true)
    public Page<RentalDto> getRentalsForProfile(String username, String viewMode, Pageable pageable) {
        Page<Rental> rentals;
        if ("rentedBy".equals(viewMode)) {
            rentals = rentalRepo.findByRenterUsername(username, pageable);
        } else { // "ownedBy"
            rentals = rentalRepo.findByRecordOfferOwnerUsername(username, pageable);
        }
        return rentals.map(this::mapToDto);
    }

    @Transactional
    public Rental updateRentalStatus(Long rentalId, RentalStatus newStatus) {
        User currentUser = authService.getAuthenticatedUser();
        Rental rental = rentalRepo.findById(rentalId).orElseThrow(() -> new EntityNotFoundException("Wypożyczenie nie znalezione."));

        validateStatusChange(rental, newStatus, currentUser);

        rental.setStatus(newStatus);

        if (newStatus == RentalStatus.RETURNED) {
            User renter = rental.getRenter();
            renter.setBalance(renter.getBalance().add(RENTAL_DEPOSIT));
            userRepo.save(renter);

            RecordOffer offer = rental.getRecordOffer();
            offer.setStatus(OfferStatus.AVAILABLE);
            recordOfferRepo.save(offer);
        }

        return rentalRepo.save(rental);
    }

    private void validateStatusChange(Rental rental, RentalStatus newStatus, User user) {
        RentalStatus currentStatus = rental.getStatus();
        boolean isOwner = user.equals(rental.getRecordOffer().getOwner());
        boolean isRenter = user.equals(rental.getRenter());

        switch (currentStatus) {
            case REQUESTED:
                if (newStatus != RentalStatus.SENT_TO_RENTER || !isOwner) throw new AccessDeniedException("Invalid action");
                break;
            case SENT_TO_RENTER:
                if (newStatus != RentalStatus.DELIVERED || !isRenter) throw new AccessDeniedException("Invalid action");
                break;
            case DELIVERED:
                if (newStatus != RentalStatus.SENT_TO_OWNER || !isRenter) throw new AccessDeniedException("Invalid action");
                break;
            case SENT_TO_OWNER:
                if (newStatus != RentalStatus.RETURNED || !isOwner) throw new AccessDeniedException("Invalid action");
                break;
            default:
                throw new AccessDeniedException("Invalid action");
        }
    }

    private RentalDto mapToDto(Rental rental) {
        RentalDto dto = new RentalDto();
        dto.setRentalId(rental.getId());
        dto.setOfferId(rental.getRecordOffer().getId());
        dto.setOfferTitle(rental.getRecordOffer().getTitle());
        dto.setOfferImageUrl(rental.getRecordOffer().getCoverImageUrl());
        dto.setStatus(rental.getStatus());
        dto.setRentalDate(rental.getRentalDate());
        dto.setReturnDate(rental.getReturnDate());

        User currentUser = authService.getAuthenticatedUser();
        if (currentUser != null && currentUser.equals(rental.getRenter())) {
            dto.setOtherPartyUsername(rental.getRecordOffer().getOwner().getUsername());
        } else {
            dto.setOtherPartyUsername(rental.getRenter().getUsername());
        }
        return dto;
    }
}