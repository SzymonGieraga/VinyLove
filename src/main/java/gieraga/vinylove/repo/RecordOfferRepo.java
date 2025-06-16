package gieraga.vinylove.repo;

import gieraga.vinylove.model.OfferStatus;
import gieraga.vinylove.model.RecordOffer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordOfferRepo extends JpaRepository<RecordOffer, Long> {
    Page<RecordOffer> findByStatus(OfferStatus status, Pageable pageable);

    List<RecordOffer> findByOwnerUsernameOrderByIdDesc(String username);

    @Query("SELECT o FROM RecordOffer o WHERE o.status = :status AND " +
            "(LOWER(o.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(o.artists) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(o.owner.username) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<RecordOffer> searchAvailableOffers(@Param("status") OfferStatus status, @Param("query") String query, Pageable pageable);
}