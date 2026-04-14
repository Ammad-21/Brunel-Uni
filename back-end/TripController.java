package a2.startup2.co2.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import a2.startup2.co2.Model.Trip;
import a2.startup2.co2.Service.TripService;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/{id}")
    public Optional<Trip> getTripById(@PathVariable Long id) {
        return tripService.getTripById(id);
    }

   @PostMapping
    public Trip createTrip(@RequestBody TripDTO tripDTO) {

    Trip trip = new Trip();
    trip.setUserId(tripDTO.getUserId());
    trip.setTransportMode(tripDTO.getTransportMode());
    trip.setDistanceKm(tripDTO.getDistanceKm());

    float co2PerKm = switch (trip.getTransportMode().toLowerCase()) {
        case "car" -> 0.192f;
        case "bus" -> 0.105f;
        default -> 0f;
    };

    trip.setCo2Emission(co2PerKm * trip.getDistanceKm());

    return tripService.addTrip(trip);
}

    @PutMapping("/{id}")
    public Trip updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        trip.setTripId(id);
        return tripService.updateTrip(trip);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
    }
}
