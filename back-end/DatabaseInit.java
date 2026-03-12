package a2.startup2.co2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;
import a2.startup2.co2.Model.Trip;
import a2.startup2.co2.Repos.TripRepository;

@Component
public class DatabaseInit implements CommandLineRunner {

    @Autowired
    private TripRepository tripRepository;

    @Override
    public void run(String... args) throws Exception {
        tripRepository.deleteAll();

        Trip t1 = new Trip(1L, "Car", 10.5f, 0.192f * 10.5f);
        Trip t2 = new Trip(2L, "Bus", 5f, 0.105f * 5f);
        Trip t3 = new Trip(1L, "Bike", 2f, 0f);

        tripRepository.save(t1);
        tripRepository.save(t2);
        tripRepository.save(t3);

        System.out.println("Sample trips saved.");
    }
}
