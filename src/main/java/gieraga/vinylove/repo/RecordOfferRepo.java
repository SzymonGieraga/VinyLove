package gieraga.vinylove.repo;

import gieraga.vinylove.model.RecordOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordOfferRepo extends JpaRepository<RecordOffer, Long> {
}