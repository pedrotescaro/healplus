package com.healplus.backend.Repository.Monitoring;

import com.healplus.backend.Model.Entity.TelehealthSession;
import com.healplus.backend.Model.Entity.Patient;
import com.healplus.backend.Model.Entity.Professional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TelehealthSessionRepository extends JpaRepository<TelehealthSession, UUID> {
    
    List<TelehealthSession> findByPatient(Patient patient);
    
    List<TelehealthSession> findByProfessional(Professional professional);
    
    List<TelehealthSession> findByPatientOrderByScheduledStartTimeDesc(Patient patient);
    
    List<TelehealthSession> findByProfessionalOrderByScheduledStartTimeDesc(Professional professional);
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.patient = :patient AND ts.status = :status")
    List<TelehealthSession> findByPatientAndStatus(@Param("patient") Patient patient, 
                                                  @Param("status") TelehealthSession.SessionStatus status);
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.professional = :professional AND ts.status = :status")
    List<TelehealthSession> findByProfessionalAndStatus(@Param("professional") Professional professional, 
                                                    @Param("status") TelehealthSession.SessionStatus status);
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.sessionType = :type")
    List<TelehealthSession> findBySessionType(@Param("type") TelehealthSession.SessionType type);
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.status = :status")
    List<TelehealthSession> findByStatus(@Param("status") TelehealthSession.SessionStatus status);
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.scheduledStartTime >= :startDate AND ts.scheduledStartTime <= :endDate")
    List<TelehealthSession> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.professional = :professional AND ts.scheduledStartTime >= :startDate AND ts.scheduledStartTime <= :endDate")
    List<TelehealthSession> findByProfessionalAndDateRange(@Param("professional") Professional professional,
                                                       @Param("startDate") LocalDateTime startDate, 
                                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.patient = :patient AND ts.scheduledStartTime >= :startDate AND ts.scheduledStartTime <= :endDate")
    List<TelehealthSession> findByPatientAndDateRange(@Param("patient") Patient patient,
                                                     @Param("startDate") LocalDateTime startDate, 
                                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.requiresFollowUp = true")
    List<TelehealthSession> findSessionsRequiringFollowUp();
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.technicalIssues = true")
    List<TelehealthSession> findSessionsWithTechnicalIssues();
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.isRecorded = true")
    List<TelehealthSession> findRecordedSessions();
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.patientConsentGiven = false")
    List<TelehealthSession> findSessionsWithoutConsent();
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.patientSatisfaction IS NOT NULL ORDER BY ts.patientSatisfaction DESC")
    List<TelehealthSession> findSessionsOrderedByPatientSatisfaction();
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.professionalSatisfaction IS NOT NULL ORDER BY ts.professionalSatisfaction DESC")
    List<TelehealthSession> findSessionsOrderedByProfessionalSatisfaction();
    
    @Query("SELECT AVG(ts.patientSatisfaction) FROM TelehealthSession ts WHERE ts.patientSatisfaction IS NOT NULL")
    Double getAveragePatientSatisfaction();
    
    @Query("SELECT AVG(ts.professionalSatisfaction) FROM TelehealthSession ts WHERE ts.professionalSatisfaction IS NOT NULL")
    Double getAverageProfessionalSatisfaction();
    
    @Query("SELECT AVG(ts.sessionDuration) FROM TelehealthSession ts WHERE ts.sessionDuration IS NOT NULL")
    Double getAverageSessionDuration();
    
    @Query("SELECT COUNT(ts) FROM TelehealthSession ts WHERE ts.status = :status AND ts.scheduledStartTime >= :startDate AND ts.scheduledStartTime <= :endDate")
    Long countSessionsByStatusAndDateRange(@Param("status") TelehealthSession.SessionStatus status,
                                          @Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ts FROM TelehealthSession ts WHERE ts.meetingRoomId = :roomId")
    Optional<TelehealthSession> findByMeetingRoomId(@Param("roomId") String roomId);
}
