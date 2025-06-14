package gieraga.vinylove.repo;

import gieraga.vinylove.model.RewardCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardCodeRepo extends JpaRepository<RewardCode, Long> {
}