package com.ecomove.backend.controller;

import com.ecomove.backend.model.TransportType;
import com.ecomove.backend.repository.TransportTypeRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transport-types")
public class TransportTypeController {
  private final TransportTypeRepository transportTypeRepository;

  public TransportTypeController(TransportTypeRepository transportTypeRepository) {
    this.transportTypeRepository = transportTypeRepository;
  }

  @GetMapping
  public List<TransportType> getAllTransportTypes() {
    return transportTypeRepository.findAll();
  }
}

