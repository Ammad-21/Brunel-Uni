package com.ecomove.backend.controller;

import com.ecomove.backend.model.User;
import com.ecomove.backend.model.UserSession;
import com.ecomove.backend.service.AuthService;
import com.ecomove.backend.service.UserSessionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;
  private final UserSessionService userSessionService;

  public AuthController(AuthService authService, UserSessionService userSessionService) {
    this.authService = authService;
    this.userSessionService = userSessionService;
  }

  public record LoginRequest(String email, String password) {}

  public record LoginResponse(Long userId, String name, String email, Long sessionId) {}

  @PostMapping("/login")
  public LoginResponse login(@RequestBody LoginRequest request) {
    User user = authService.login(request.email(), request.password());
    UserSession session = userSessionService.createSession(user);
    return new LoginResponse(user.getId(), user.getName(), user.getEmail(), session.getId());
  }
}

