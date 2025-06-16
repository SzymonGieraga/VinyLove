package gieraga.vinylove.repo;

import gieraga.vinylove.model.RecordReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordReviewRepo extends JpaRepository<RecordReview, Long> {

    List<RecordReview> findByRecordOfferIdOrderByCreatedAtDesc(Long offerId);
}