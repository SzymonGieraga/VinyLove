package gieraga.vinylove.repo;

import gieraga.vinylove.model.RecordReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecordReviewRepo extends JpaRepository<RecordReview, Long> {

    List<RecordReview> findByRecordOfferIdOrderByCreatedAtDesc(Long offerId);

    Page<RecordReview> findByAuthorUsername(String username, Pageable pageable);
    List<RecordReview> findByAuthorUsername(String username);

    Page<RecordReview> findByRecordOfferOwnerUsername(String username, Pageable pageable);
    List<RecordReview> findByRecordOfferOwnerUsername(String username);
}