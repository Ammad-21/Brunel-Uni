package com.ecomove.backend.dto;

public record UserStatsDTO(
    Long userId,
    long totalTrips,
    double totalDistanceKm,
    double totalCO2Emitted,
    double totalCO2Saved) {}

