package com.ecomove.backend.service;

import com.ecomove.backend.dto.LeaderboardDTO;
import com.ecomove.backend.repository.TripRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardService {
  private final TripRepository tripRepository;

  public LeaderboardService(TripRepository tripRepository) {
    this.tripRepository = tripRepository;
  }

  public List<LeaderboardDTO> getLeaderboard() {
    return tripRepository.getLeaderboard();
  }
}

