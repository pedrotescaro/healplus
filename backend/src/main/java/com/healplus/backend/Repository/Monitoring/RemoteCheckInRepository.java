package com.healplus.backend.Repository.Monitoring;

import com.healplus.backend.Model.Entity.Patient;
import com.healplus.backend.Model.Entity.RemoteCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RemoteCheckInRepository extends JpaRepository<RemoteCheckIn, UUID> {
    
    List<RemoteCheckIn> findByPatientOrderByCheckinTimeDesc(Patient patient);
    
    List<RemoteCheckIn> findByPatientAndCheckinTimeBetweenOrderByCheckinTimeDesc(
            Patient patient, LocalDateTime start, LocalDateTime end);
    
    List<RemoteCheckIn> findByPatientAndTypeOrderByCheckinTimeDesc(
            Patient patient, RemoteCheckIn.CheckInType type);
    
    List<RemoteCheckIn> findByPatientAndStatusOrderByCheckinTimeDesc(
            Patient patient, RemoteCheckIn.CheckInStatus status);
    
    List<RemoteCheckIn> findByPatientAndRiskLevelOrderByCheckinTimeDesc(
            Patient patient, RemoteCheckIn.RiskLevel riskLevel);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.patient = :patient AND r.checkinTime >= :since ORDER BY r.checkinTime DESC")
    List<RemoteCheckIn> findRecentCheckIns(@Param("patient") Patient patient, @Param("since") LocalDateTime since);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.patient = :patient AND r.type = :type AND r.checkinTime >= :since ORDER BY r.checkinTime DESC")
    List<RemoteCheckIn> findRecentCheckInsByType(
            @Param("patient") Patient patient, 
            @Param("type") RemoteCheckIn.CheckInType type, 
            @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(r) FROM RemoteCheckIn r WHERE r.patient = :patient AND r.checkinTime >= :since")
    Long countCheckInsSince(@Param("patient") Patient patient, @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(r) FROM RemoteCheckIn r WHERE r.patient = :patient AND r.type = :type AND r.checkinTime >= :since")
    Long countCheckInsByTypeSince(
            @Param("patient") Patient patient, 
            @Param("type") RemoteCheckIn.CheckInType type, 
            @Param("since") LocalDateTime since);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.status = :status ORDER BY r.checkinTime DESC")
    List<RemoteCheckIn> findByStatusOrderByCheckinTimeDesc(RemoteCheckIn.CheckInStatus status);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.riskLevel IN :riskLevels ORDER BY r.checkinTime DESC")
    List<RemoteCheckIn> findByRiskLevelInOrderByCheckinTimeDesc(@Param("riskLevels") List<RemoteCheckIn.RiskLevel> riskLevels);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.patient = :patient AND r.checkinTime >= :start AND r.checkinTime <= :end ORDER BY r.checkinTime ASC")
    List<RemoteCheckIn> findCheckInsInDateRange(
            @Param("patient") Patient patient, 
            @Param("start") LocalDateTime start, 
            @Param("end") LocalDateTime end);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.patient = :patient AND r.type = 'PHOTO' AND r.checkinTime >= :since ORDER BY r.checkinTime DESC")
    List<RemoteCheckIn> findRecentPhotoCheckIns(@Param("patient") Patient patient, @Param("since") LocalDateTime since);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.patient = :patient AND r.type = 'SYMPTOMS' AND r.checkinTime >= :since ORDER BY r.checkinTime DESC")
    List<RemoteCheckIn> findRecentSymptomCheckIns(@Param("patient") Patient patient, @Param("since") LocalDateTime since);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.patient = :patient AND r.type = 'MEDICATION' AND r.checkinTime >= :since ORDER BY r.checkinTime DESC")
    List<RemoteCheckIn> findRecentMedicationCheckIns(@Param("patient") Patient patient, @Param("since") LocalDateTime since);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.patient = :patient AND r.riskLevel = 'HIGH' AND r.checkinTime >= :since ORDER BY r.checkinTime DESC")
    List<RemoteCheckIn> findHighRiskCheckIns(@Param("patient") Patient patient, @Param("since") LocalDateTime since);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.patient = :patient AND r.riskLevel = 'CRITICAL' ORDER BY r.checkinTime DESC")
    List<RemoteCheckIn> findCriticalRiskCheckIns(@Param("patient") Patient patient);
    
    @Query("SELECT AVG(r.riskScore) FROM RemoteCheckIn r WHERE r.patient = :patient AND r.checkinTime >= :since")
    Optional<Double> getAverageRiskScore(@Param("patient") Patient patient, @Param("since") LocalDateTime since);
    
    @Query("SELECT r FROM RemoteCheckIn r WHERE r.patient = :patient AND r.checkinTime >= :since AND r.type = :type ORDER BY r.checkinTime DESC LIMIT 1")
    Optional<RemoteCheckIn> findLatestCheckInByType(
            @Param("patient") Patient patient, 
            @Param("type") RemoteCheckIn.CheckInType type, 
            @Param("since") LocalDateTime since);
}
