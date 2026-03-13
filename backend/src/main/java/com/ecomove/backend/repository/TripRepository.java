package com.ecomove.backend.repository;

import com.ecomove.backend.dto.LeaderboardDTO;
import com.ecomove.backend.model.Trip;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
  interface UserTripStats {
    long getTotalTrips();

    double getTotalDistanceKm();

    double getTotalCO2Emitted();

    double getTotalCO2Saved();
  }

  @Override
  @EntityGraph(attributePaths = {"user", "transportType"})
  List<Trip> findAll();

  @Query("""
      select
        count(t) as totalTrips,
        coalesce(sum(t.distanceKm), 0) as totalDistanceKm,
        coalesce(sum(t.co2Emitted), 0) as totalCO2Emitted,
        coalesce(sum(t.co2Saved), 0) as totalCO2Saved
      from Trip t
      where t.user.id = :userId
      """)
  UserTripStats getUserTripStats(Long userId);

  @Query("""
      select new com.ecomove.backend.dto.LeaderboardDTO(
        u.id,
        u.name,
        coalesce(sum(t.co2Saved), 0)
      )
      from Trip t
      join t.user u
      group by u.id, u.name
      order by sum(t.co2Saved) desc
      """)
  List<LeaderboardDTO> getLeaderboard();

  @Query("""
      select coalesce(sum(t.co2Saved), 0)
      from Trip t
      """)
  Double getTotalCo2Saved();

  @Query("""
      select count(t)
      from Trip t
      where t.tripDate >= :from and t.tripDate < :to and t.co2Saved > 0
      """)
  long countLowCarbonTripsBetween(LocalDateTime from, LocalDateTime to);
}
