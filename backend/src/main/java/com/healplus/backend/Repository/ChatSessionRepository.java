package com.healplus.backend.Repository;

import com.healplus.backend.Model.ChatSession;
import com.healplus.backend.Model.Patient;
import com.healplus.backend.Model.Clinician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    
    List<ChatSession> findByPatient(Patient patient);
    
    List<ChatSession> findByClinician(Clinician clinician);
    
    List<ChatSession> findByPatientOrderByStartedAtDesc(Patient patient);
    
    List<ChatSession> findByClinicianOrderByStartedAtDesc(Clinician clinician);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.patient = :patient AND cs.status = :status")
    List<ChatSession> findByPatientAndStatus(@Param("patient") Patient patient, 
                                           @Param("status") ChatSession.SessionStatus status);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.clinician = :clinician AND cs.status = :status")
    List<ChatSession> findByClinicianAndStatus(@Param("clinician") Clinician clinician, 
                                             @Param("status") ChatSession.SessionStatus status);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.sessionType = :type")
    List<ChatSession> findBySessionType(@Param("type") ChatSession.SessionType type);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.status = :status")
    List<ChatSession> findByStatus(@Param("status") ChatSession.SessionStatus status);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.startedAt >= :startDate AND cs.startedAt <= :endDate")
    List<ChatSession> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.escalatedToHuman = true")
    List<ChatSession> findEscalatedSessions();
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.resolved = false")
    List<ChatSession> findUnresolvedSessions();
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.resolved = true")
    List<ChatSession> findResolvedSessions();
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.satisfactionRating IS NOT NULL ORDER BY cs.satisfactionRating DESC")
    List<ChatSession> findSessionsOrderedBySatisfaction();
    
    @Query("SELECT AVG(cs.satisfactionRating) FROM ChatSession cs WHERE cs.satisfactionRating IS NOT NULL")
    Double getAverageSatisfactionRating();
    
    @Query("SELECT AVG(cs.messageCount) FROM ChatSession cs")
    Double getAverageMessageCount();
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.lastActivity >= :lastActivityTime")
    List<ChatSession> findActiveSessions(@Param("lastActivityTime") LocalDateTime lastActivityTime);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.lastActivity < :inactiveTime")
    List<ChatSession> findInactiveSessions(@Param("inactiveTime") LocalDateTime inactiveTime);
    
    @Query("SELECT COUNT(cs) FROM ChatSession cs WHERE cs.status = :status AND cs.startedAt >= :startDate AND cs.startedAt <= :endDate")
    Long countSessionsByStatusAndDateRange(@Param("status") ChatSession.SessionStatus status,
                                          @Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.sessionId = :sessionId")
    Optional<ChatSession> findBySessionId(@Param("sessionId") String sessionId);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.patient = :patient AND cs.sessionType = :type ORDER BY cs.startedAt DESC")
    List<ChatSession> findRecentSessionsByPatientAndType(@Param("patient") Patient patient, 
                                                        @Param("type") ChatSession.SessionType type);
}
