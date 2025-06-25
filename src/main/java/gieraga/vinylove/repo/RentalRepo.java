package gieraga.vinylove.repo;

import gieraga.vinylove.model.Rental;
import gieraga.vinylove.model.RentalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gieraga.vinylove.model.RecordOffer;
import gieraga.vinylove.model.User;

import java.time.LocalDate;
import java.util.List;

@Repository


public interface RentalRepo extends JpaRepository<Rental, Long> {
    boolean existsByRenterAndRecordOffer(User renter, RecordOffer offer);

    Page<Rental> findByRenterUsername(String username, Pageable pageable);

    Page<Rental> findByRecordOfferOwnerUsername(String username, Pageable pageable);

    List<Rental> findByStatusAndReturnDateAndReminderSentIsFalse(RentalStatus status, LocalDate returnDate);

    long countByRenter(User renter);
}
