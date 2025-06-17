package gieraga.vinylove.repo;

import gieraga.vinylove.model.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReviewRepo extends JpaRepository<UserReview, Long> {

    List<UserReview> findByReviewerUsername(String username);
    List<UserReview> findByReviewedUserUsername(String username);
}