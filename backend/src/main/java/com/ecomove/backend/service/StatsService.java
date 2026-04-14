package com.ecomove.backend.service;

import com.ecomove.backend.dto.LeaderboardDTO;
import com.ecomove.backend.dto.SummaryStatsDTO;
import com.ecomove.backend.repository.TripRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StatsService {
  private final TripRepository tripRepository;
  private final UserSessionService userSessionService;

  public StatsService(TripRepository tripRepository, UserSessionService userSessionService) {
    this.tripRepository = tripRepository;
    this.userSessionService = userSessionService;
  }

  public SummaryStatsDTO getSummary() {
    long totalTrips = tripRepository.count();
    Double totalCo2SavedRaw = tripRepository.getTotalCo2Saved();
    double totalCO2Saved = totalCo2SavedRaw == null ? 0 : totalCo2SavedRaw;
    long activeUsers = userSessionService.countActiveUsers();

    LocalDate today = LocalDate.now();
    LocalDateTime from = today.atStartOfDay();
    LocalDateTime to = today.plusDays(1).atStartOfDay();
    long lowCarbonTripsToday = tripRepository.countLowCarbonTripsBetween(from, to);

    List<LeaderboardDTO> leaderboardTop = tripRepository.getLeaderboard().stream().limit(3).toList();
    return new SummaryStatsDTO(
        totalTrips, totalCO2Saved, activeUsers, lowCarbonTripsToday, leaderboardTop);
  }
}
