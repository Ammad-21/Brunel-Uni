package com.ecomove.backend.controller;

import com.ecomove.backend.dto.UserStatsDTO;
import com.ecomove.backend.model.User;
import com.ecomove.backend.service.TripService;
import com.ecomove.backend.service.UserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;
  private final TripService tripService;

  public UserController(UserService userService, TripService tripService) {
    this.userService = userService;
    this.tripService = tripService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public User createUser(@RequestBody User user) {
    return userService.createUser(user);
  }

  @GetMapping
  public List<User> getAllUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/{id}/stats")
  public UserStatsDTO getUserStats(@PathVariable("id") Long userId) {
    return tripService.getUserStats(userId);
  }
}
