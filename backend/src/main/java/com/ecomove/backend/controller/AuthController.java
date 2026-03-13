package com.ecomove.backend.controller;

import com.ecomove.backend.model.User;
import com.ecomove.backend.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  public record LoginRequest(String email, String password) {}

  public record LoginResponse(Long userId, String name, String email) {}

  @PostMapping("/login")
  public LoginResponse login(@RequestBody LoginRequest request) {
    User user = authService.login(request.email(), request.password());
    return new LoginResponse(user.getId(), user.getName(), user.getEmail());
  }
}

