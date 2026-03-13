package com.ecomove.backend.repository;

import com.ecomove.backend.model.TransportType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransportTypeRepository extends JpaRepository<TransportType, Long> {
  Optional<TransportType> findByNameIgnoreCase(String name);
}

