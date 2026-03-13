package com.ecomove.backend.service;

import com.ecomove.backend.model.TransportType;
import com.ecomove.backend.repository.TransportTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TransportTypeInitializer implements CommandLineRunner {
  private final TransportTypeRepository transportTypeRepository;

  public TransportTypeInitializer(TransportTypeRepository transportTypeRepository) {
    this.transportTypeRepository = transportTypeRepository;
  }

  @Override
  public void run(String... args) {
    upsert("Car", 0.192);
    upsert("Bus", 0.105);
    upsert("Train", 0.041);
    upsert("Bike", 0.0);
    upsert("Walking", 0.0);
  }

  private void upsert(String name, double co2PerKm) {
    transportTypeRepository
        .findByNameIgnoreCase(name)
        .ifPresentOrElse(
            existing -> {
              if (Double.compare(existing.getCo2PerKm(), co2PerKm) != 0) {
                existing.setCo2PerKm(co2PerKm);
                transportTypeRepository.save(existing);
              }
            },
            () -> {
              TransportType transportType = new TransportType();
              transportType.setName(name);
              transportType.setCo2PerKm(co2PerKm);
              transportTypeRepository.save(transportType);
            });
  }
}
