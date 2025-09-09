package com.healplus.backend.Repository;

import com.healplus.backend.Model.User;
import com.healplus.backend.Model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Optional<User> findByEmailVerificationToken(String token);
    
    Optional<User> findByPasswordResetToken(String token);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByEnabled(Boolean enabled);
    
    @Query("SELECT u FROM User u WHERE u.dataProcessingConsent = true")
    List<User> findUsersWithDataConsent();
    
    @Query("SELECT u FROM User u WHERE u.lastLoginAt >= :since")
    List<User> findActiveUsersSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT u FROM User u WHERE u.createdAt >= :since")
    List<User> findNewUsersSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.enabled = true")
    Long countActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.lastDataAccessAt >= :since OR u.lastDataModificationAt >= :since")
    List<User> findUsersWithRecentDataActivity(@Param("since") LocalDateTime since);
}
