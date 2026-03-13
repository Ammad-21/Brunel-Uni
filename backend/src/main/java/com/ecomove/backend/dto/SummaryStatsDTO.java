package com.ecomove.backend.dto;

import java.util.List;

public record SummaryStatsDTO(
    long totalTrips,
    double totalCO2Saved,
    long activeUsers,
    long lowCarbonTripsToday,
    List<LeaderboardDTO> leaderboardTop) {}

