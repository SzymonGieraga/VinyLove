package gieraga.vinylove.service;

import gieraga.vinylove.model.RecordOffer;
import gieraga.vinylove.model.User;
import gieraga.vinylove.repo.RecordOfferRepo;
import gieraga.vinylove.repo.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ObservationService {

    private final AuthService authService;
    private final UserRepo userRepo;
    private final RecordOfferRepo offerRepo;

@Transactional
public void observeOffer(Long offerId) {
    String username = authService.getAuthenticatedUser().getUsername();
    User currentUser = userRepo.findByUsernameWithObservedOffers(username)
            .orElseThrow(() -> new IllegalStateException("Użytkownik nie znaleziony w tej sesji."));

    RecordOffer offer = offerRepo.findById(offerId)
            .orElseThrow(() -> new EntityNotFoundException("Oferta nie znaleziona."));

    if (offer.getOwner().equals(currentUser)) {
        throw new IllegalStateException("Nie możesz obserwować własnej oferty.");
    }

    currentUser.getObservedOffers().add(offer);
    offer.getObservers().add(currentUser);

    userRepo.save(currentUser);
}

@Transactional
public void unobserveOffer(Long offerId) {
    String username = authService.getAuthenticatedUser().getUsername();
    User currentUser = userRepo.findByUsernameWithObservedOffers(username)
            .orElseThrow(() -> new IllegalStateException("Użytkownik nie znaleziony w tej sesji."));

    boolean removedFromUser = currentUser.getObservedOffers().removeIf(offer -> offer.getId().equals(offerId));

    if (removedFromUser) {
        offerRepo.findById(offerId).ifPresent(offer -> {
            offer.getObservers().remove(currentUser);
            offerRepo.save(offer);
        });
        userRepo.save(currentUser);
    }
}
}