package com.ecomove.backend.service;

import com.ecomove.backend.model.User;
import com.ecomove.backend.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User createUser(User user) {
    if (user == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is required");
    }
    if (user.getName() == null || user.getName().trim().isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
    }
    if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is required");
    }
    if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "password is required");
    }

    String normalizedEmail = user.getEmail().trim();
    if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "email already exists");
    }

    user.setEmail(normalizedEmail);
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }
}
