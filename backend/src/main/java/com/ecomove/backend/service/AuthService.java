package com.ecomove.backend.service;

import com.ecomove.backend.model.User;
import com.ecomove.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public AuthService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User login(String email, String password) {
    if (email == null || email.trim().isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is required");
    }
    if (password == null || password.trim().isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "password is required");
    }

    User user =
        userRepository
            .findByEmailIgnoreCase(email.trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    String stored = user.getPassword();
    boolean looksHashed = stored != null && stored.startsWith("$2");
    boolean ok =
        looksHashed ? passwordEncoder.matches(password, stored) : password.equals(stored);

    if (!ok) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    if (!looksHashed) {
      user.setPassword(passwordEncoder.encode(password));
      userRepository.save(user);
    }

    return user;
  }
}
