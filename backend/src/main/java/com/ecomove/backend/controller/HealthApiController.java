package com.ecomove.backend.controller;

import java.sql.Connection;
import java.sql.Statement;
import javax.sql.DataSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/health")
public class HealthApiController {
  private final DataSource dataSource;

  public HealthApiController(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  public record ApiHealth(boolean ok) {}

  public record DbHealth(boolean ok, String jdbcUrl, String databaseProduct) {}

  @GetMapping("/status")
  public ApiHealth status() {
    return new ApiHealth(true);
  }

  @GetMapping("/db")
  public DbHealth db() {
    try (Connection connection = dataSource.getConnection();
        Statement st = connection.createStatement()) {
      st.execute("select 1");
      return new DbHealth(
          true, connection.getMetaData().getURL(), connection.getMetaData().getDatabaseProductName());
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Database not reachable");
    }
  }
}
