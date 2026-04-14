package a2.startup2.co2.Repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import a2.startup2.co2.Model.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    // Optional custom queries later
}
