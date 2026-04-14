package com.ecomove.backend.controller;

import com.ecomove.backend.service.UserSessionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

  private final UserSessionService userSessionService;

  public SessionController(UserSessionService userSessionService) {
    this.userSessionService = userSessionService;
  }

  @PostMapping("/{sessionId}/heartbeat")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void heartbeat(@PathVariable Long sessionId) {
    userSessionService.heartbeat(sessionId);
  }

  @PostMapping("/{sessionId}/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(@PathVariable Long sessionId) {
    userSessionService.logout(sessionId);
  }
}
