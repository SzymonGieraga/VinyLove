package gieraga.vinylove.repo;

import gieraga.vinylove.model.OfferStatus;
import gieraga.vinylove.model.RecordOffer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordOfferRepo extends JpaRepository<RecordOffer, Long> {
    Page<RecordOffer> findByStatus(OfferStatus status, Pageable pageable);
}