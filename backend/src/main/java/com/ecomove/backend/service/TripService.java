package com.ecomove.backend.service;

import com.ecomove.backend.dto.UserStatsDTO;
import com.ecomove.backend.model.Trip;
import com.ecomove.backend.model.TransportType;
import com.ecomove.backend.model.User;
import com.ecomove.backend.repository.TripRepository;
import com.ecomove.backend.repository.TransportTypeRepository;
import com.ecomove.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TripService {
  private final TripRepository tripRepository;
  private final UserRepository userRepository;
  private final TransportTypeRepository transportTypeRepository;

  public TripService(
      TripRepository tripRepository,
      UserRepository userRepository,
      TransportTypeRepository transportTypeRepository) {
    this.tripRepository = tripRepository;
    this.userRepository = userRepository;
    this.transportTypeRepository = transportTypeRepository;
  }

  public Trip createTrip(Long userId, Long transportTypeId, double distanceKm) {
    if (distanceKm <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "distanceKm must be > 0");
    }

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    TransportType transportType =
        transportTypeRepository
            .findById(transportTypeId)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transport type not found"));

    TransportType carType =
        transportTypeRepository
            .findByNameIgnoreCase("Car")
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Default transport type 'Car' missing"));

    double co2Emitted = distanceKm * transportType.getCo2PerKm();
    double carEmission = distanceKm * carType.getCo2PerKm();
    double co2Saved = carEmission - co2Emitted;

    Trip trip = new Trip();
    trip.setUser(user);
    trip.setTransportType(transportType);
    trip.setDistanceKm(distanceKm);
    trip.setCo2Emitted(co2Emitted);
    trip.setCo2Saved(co2Saved);
    trip.setTripDate(LocalDateTime.now());

    return tripRepository.save(trip);
  }

  public List<Trip> getAllTrips() {
    return tripRepository.findAll();
  }

  public UserStatsDTO getUserStats(Long userId) {
    userRepository
        .findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    TripRepository.UserTripStats stats = tripRepository.getUserTripStats(userId);

    return new UserStatsDTO(
        userId,
        stats.getTotalTrips(),
        stats.getTotalDistanceKm(),
        stats.getTotalCO2Emitted(),
        stats.getTotalCO2Saved());
  }
}
