package gieraga.vinylove.repo;

import gieraga.vinylove.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gieraga.vinylove.model.RecordOffer;
import gieraga.vinylove.model.User;

@Repository


public interface RentalRepo extends JpaRepository<Rental, Long> {
    boolean existsByRenterAndRecordOffer(User renter, RecordOffer offer);
}