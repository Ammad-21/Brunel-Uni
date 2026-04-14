package com.ecomove.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_sessions")
public class UserSession {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false)
  private LocalDateTime loginTime;

  @Column(nullable = false)
  private LocalDateTime lastActiveTime;

  @Column
  private LocalDateTime logoutTime;

  public UserSession() {}

  public UserSession(User user, LocalDateTime loginTime) {
    this.user = user;
    this.loginTime = loginTime;
    this.lastActiveTime = loginTime;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }

  public LocalDateTime getLoginTime() { return loginTime; }
  public void setLoginTime(LocalDateTime loginTime) { this.loginTime = loginTime; }

  public LocalDateTime getLastActiveTime() { return lastActiveTime; }
  public void setLastActiveTime(LocalDateTime lastActiveTime) { this.lastActiveTime = lastActiveTime; }

  public LocalDateTime getLogoutTime() { return logoutTime; }
  public void setLogoutTime(LocalDateTime logoutTime) { this.logoutTime = logoutTime; }
}
