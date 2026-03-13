package com.ecomove.backend.controller;

import com.ecomove.backend.dto.SummaryStatsDTO;
import com.ecomove.backend.service.StatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
  private final StatsService statsService;

  public StatsController(StatsService statsService) {
    this.statsService = statsService;
  }

  @GetMapping("/summary")
  public SummaryStatsDTO getSummary() {
    return statsService.getSummary();
  }
}

