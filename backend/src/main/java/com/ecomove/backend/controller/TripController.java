package com.ecomove.backend.controller;

import com.ecomove.backend.model.Trip;
import com.ecomove.backend.service.TripService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips")
public class TripController {
  private final TripService tripService;

  public TripController(TripService tripService) {
    this.tripService = tripService;
  }

  public record CreateTripRequest(Long userId, Long transportTypeId, double distanceKm) {}

  public record TripResponse(
      Long id,
      Long userId,
      Long transportTypeId,
      String transportTypeName,
      double distanceKm,
      double co2Emitted,
      double co2Saved,
      LocalDateTime tripDate) {}

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public TripResponse createTrip(@RequestBody CreateTripRequest request) {
    Trip trip = tripService.createTrip(request.userId(), request.transportTypeId(), request.distanceKm());
    return toResponse(trip);
  }

  @GetMapping
  public List<TripResponse> getAllTrips() {
    return tripService.getAllTrips().stream().map(this::toResponse).toList();
  }

  private TripResponse toResponse(Trip trip) {
    return new TripResponse(
        trip.getId(),
        trip.getUser().getId(),
        trip.getTransportType().getId(),
        trip.getTransportType().getName(),
        trip.getDistanceKm(),
        trip.getCo2Emitted(),
        trip.getCo2Saved(),
        trip.getTripDate());
  }
}
