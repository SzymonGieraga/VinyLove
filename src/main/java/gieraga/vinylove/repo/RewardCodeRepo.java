package gieraga.vinylove.repo;

import gieraga.vinylove.model.RewardCode;
import gieraga.vinylove.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RewardCodeRepo extends JpaRepository<RewardCode, Long> {
    List<RewardCode> findByUserOrderByCreatedAtDesc(User user);
    long countByUser(User user);
}