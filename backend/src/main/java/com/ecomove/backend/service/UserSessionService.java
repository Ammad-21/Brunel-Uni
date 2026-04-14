package com.ecomove.backend.service;

import com.ecomove.backend.model.User;
import com.ecomove.backend.model.UserSession;
import com.ecomove.backend.repository.UserSessionRepository;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserSessionService {

  // A user is considered "active" if they sent a heartbeat in the last 5 minutes
  private static final int ACTIVE_WINDOW_MINUTES = 5;

  private final UserSessionRepository userSessionRepository;

  public UserSessionService(UserSessionRepository userSessionRepository) {
    this.userSessionRepository = userSessionRepository;
  }

  public UserSession createSession(User user) {
    UserSession session = new UserSession(user, LocalDateTime.now());
    return userSessionRepository.save(session);
  }

  public void heartbeat(Long sessionId) {
    UserSession session = userSessionRepository.findById(sessionId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
    session.setLastActiveTime(LocalDateTime.now());
    userSessionRepository.save(session);
  }

  public void logout(Long sessionId) {
    UserSession session = userSessionRepository.findById(sessionId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
    session.setLogoutTime(LocalDateTime.now());
    userSessionRepository.save(session);
  }

  public long countActiveUsers() {
    LocalDateTime since = LocalDateTime.now().minusMinutes(ACTIVE_WINDOW_MINUTES);
    return userSessionRepository.countActiveUsersSince(since);
  }
}
