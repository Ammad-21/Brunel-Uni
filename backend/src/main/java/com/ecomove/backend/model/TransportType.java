package com.ecomove.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "transport_types")
public class TransportType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  @Column(nullable = false)
  private double co2PerKm;

  public TransportType() {}

  public TransportType(Long id, String name, double co2PerKm) {
    this.id = id;
    this.name = name;
    this.co2PerKm = co2PerKm;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public double getCo2PerKm() {
    return co2PerKm;
  }

  public void setCo2PerKm(double co2PerKm) {
    this.co2PerKm = co2PerKm;
  }
}
