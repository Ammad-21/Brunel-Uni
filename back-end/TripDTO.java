package a2.startup2.co2.DTO;

public class TripDTO {

    private Long userId;
    private String transportMode;
    private float distanceKm;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTransportMode() {
        return transportMode;
    }

    public void setTransportMode(String transportMode) {
        this.transportMode = transportMode;
    }

    public float getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(float distanceKm) {
        this.distanceKm = distanceKm;
    }
}
