package gieraga.vinylove.repo;

import gieraga.vinylove.model.ParcelLocker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParcelLockerRepo extends JpaRepository<ParcelLocker, Long> {
}