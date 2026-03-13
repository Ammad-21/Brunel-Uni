package com.ecomove.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "transport_type_id", nullable = false)
  private TransportType transportType;

  @Column(nullable = false)
  private double distanceKm;

  @Column(nullable = false, columnDefinition = "float8 default 0")
  private double co2Emitted;

  @Column(nullable = false, columnDefinition = "float8 default 0")
  private double co2Saved;

  @Column(nullable = false)
  private LocalDateTime tripDate;

  public Trip() {}

  public Trip(
      Long id,
      User user,
      TransportType transportType,
      double distanceKm,
      double co2Emitted,
      double co2Saved,
      LocalDateTime tripDate) {
    this.id = id;
    this.user = user;
    this.transportType = transportType;
    this.distanceKm = distanceKm;
    this.co2Emitted = co2Emitted;
    this.co2Saved = co2Saved;
    this.tripDate = tripDate;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public TransportType getTransportType() {
    return transportType;
  }

  public void setTransportType(TransportType transportType) {
    this.transportType = transportType;
  }

  public double getDistanceKm() {
    return distanceKm;
  }

  public void setDistanceKm(double distanceKm) {
    this.distanceKm = distanceKm;
  }

  public double getCo2Emitted() {
    return co2Emitted;
  }

  public void setCo2Emitted(double co2Emitted) {
    this.co2Emitted = co2Emitted;
  }

  public double getCo2Saved() {
    return co2Saved;
  }

  public void setCo2Saved(double co2Saved) {
    this.co2Saved = co2Saved;
  }

  public LocalDateTime getTripDate() {
    return tripDate;
  }

  public void setTripDate(LocalDateTime tripDate) {
    this.tripDate = tripDate;
  }
}
