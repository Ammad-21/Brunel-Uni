package com.ecomove.backend.repository;

import com.ecomove.backend.model.UserSession;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

  // Count sessions where user was active in the last N minutes and hasn't logged out
  @Query("""
      select count(distinct s.user.id)
      from UserSession s
      where s.lastActiveTime >= :since and s.logoutTime is null
      """)
  long countActiveUsersSince(LocalDateTime since);
}
