package a2.startup2.co2.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import a2.startup2.co2.Model.Trip;
import a2.startup2.co2.Repos.TripRepository;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    public List<Trip> getAllTrips() { return tripRepository.findAll(); }

    public Trip addTrip(Trip trip) { return tripRepository.save(trip); }

    public Optional<Trip> getTripById(Long id) { return tripRepository.findById(id); }

    public Trip updateTrip(Trip trip) { return tripRepository.save(trip); }

    public void deleteTrip(Long id) { tripRepository.deleteById(id); }
}
