package gieraga.vinylove.service;

import gieraga.vinylove.dto.RentalRequestDto;
import gieraga.vinylove.model.*;
import gieraga.vinylove.repo.RecordOfferRepo;
import gieraga.vinylove.repo.UserRepo;
import gieraga.vinylove.repo.RentalRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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

    private static final BigDecimal RENTAL_DEPOSIT = new BigDecimal("50.00");

    @Transactional
    public Rental createRental(RentalRequestDto rentalRequestDto) {
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

        Rental rental = new Rental();
        rental.setRenter(renter);
        rental.setRecordOffer(offer);
        rental.setRentalDate(LocalDate.now());
        rental.setReturnDate(LocalDate.now().plusDays(rentalRequestDto.getRentalDays()));
        rental.setDeliveryMethod(rentalRequestDto.getDeliveryMethod());
        rental.setDeliveryAddress(rentalRequestDto.getDeliveryAddress());

        rental.setStatus(RentalStatus.REQUESTED);

        return rentalRepo.save(rental);
    }
}