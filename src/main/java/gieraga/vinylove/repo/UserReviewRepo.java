package gieraga.vinylove.repo;

import gieraga.vinylove.model.UserReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserReviewRepo extends JpaRepository<UserReview, Long> {

    Page<UserReview> findByReviewerUsername(String username, Pageable pageable);
    List<UserReview> findByReviewerUsername(String username); // Wersja bez paginacji

    Page<UserReview> findByReviewedUserUsername(String username, Pageable pageable);
    List<UserReview> findByReviewedUserUsername(String username); // Wersja bez paginacji
}