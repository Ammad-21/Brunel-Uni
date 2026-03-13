package com.ecomove.backend.controller;

import com.ecomove.backend.dto.LeaderboardDTO;
import com.ecomove.backend.service.LeaderboardService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
  private final LeaderboardService leaderboardService;

  public LeaderboardController(LeaderboardService leaderboardService) {
    this.leaderboardService = leaderboardService;
  }

  @GetMapping
  public List<LeaderboardDTO> getLeaderboard() {
    return leaderboardService.getLeaderboard();
  }
}

