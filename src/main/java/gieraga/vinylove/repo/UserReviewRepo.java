package gieraga.vinylove.repo;

import gieraga.vinylove.model.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReviewRepo extends JpaRepository<UserReview, Long> {
}