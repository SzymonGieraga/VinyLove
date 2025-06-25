package gieraga.vinylove.repo;

import gieraga.vinylove.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.observedOffers WHERE u.username = :username")
    Optional<User> findByUsernameWithObservedOffers(@Param("username") String username);

    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.observedOffers o WHERE u.username = :username AND o.id = :offerId")
    boolean isObservingOffer(@Param("username") String username, @Param("offerId") Long offerId);
}