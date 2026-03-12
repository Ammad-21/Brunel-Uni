package a2.startup2.co2.Model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tripId;

    private Long userId; // FK to users table, can be null for now

    @NotBlank
    private String transportMode;

    private Float distanceKm;
    private Float co2Emission;

    private LocalDateTime createdAt = LocalDateTime.now(); // auto-set

    // Constructors
    public Trip() {}

    public Trip(Long userId, String transportMode, Float distanceKm, Float co2Emission) {
        this.userId = userId;
        this.transportMode = transportMode;
        this.distanceKm = distanceKm;
        this.co2Emission = co2Emission;
    }

    // Getters and setters
    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTransportMode() { return transportMode; }
    public void setTransportMode(String transportMode) { this.transportMode = transportMode; }

    public Float getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Float distanceKm) { this.distanceKm = distanceKm; }

    public Float getCo2Emission() { return co2Emission; }
    public void setCo2Emission(Float co2Emission) { this.co2Emission = co2Emission; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
