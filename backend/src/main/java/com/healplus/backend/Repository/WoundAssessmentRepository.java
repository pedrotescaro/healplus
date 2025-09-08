package com.healplus.backend.Repository;

import com.healplus.backend.Model.WoundAssessment;
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
public interface WoundAssessmentRepository extends JpaRepository<WoundAssessment, Long> {
    
    List<WoundAssessment> findByPatient(Patient patient);
    
    List<WoundAssessment> findByClinician(Clinician clinician);
    
    List<WoundAssessment> findByPatientOrderByAssessmentDateDesc(Patient patient);
    
    List<WoundAssessment> findByClinicianOrderByAssessmentDateDesc(Clinician clinician);
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.patient = :patient AND wa.assessmentDate >= :startDate ORDER BY wa.assessmentDate DESC")
    List<WoundAssessment> findRecentAssessmentsByPatient(@Param("patient") Patient patient, 
                                                        @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.infectionRiskLevel = :riskLevel")
    List<WoundAssessment> findByInfectionRiskLevel(@Param("riskLevel") WoundAssessment.InfectionRiskLevel riskLevel);
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.healingTrajectory = :trajectory")
    List<WoundAssessment> findByHealingTrajectory(@Param("trajectory") WoundAssessment.HealingTrajectory trajectory);
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.needsAdvancedTherapy = true")
    List<WoundAssessment> findAssessmentsNeedingAdvancedTherapy();
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.needsSpecialistReferral = true")
    List<WoundAssessment> findAssessmentsNeedingSpecialistReferral();
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.patient = :patient AND wa.woundLocation = :location")
    List<WoundAssessment> findByPatientAndLocation(@Param("patient") Patient patient, 
                                                  @Param("location") String location);
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.assessmentDate >= :startDate AND wa.assessmentDate <= :endDate")
    List<WoundAssessment> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.patient = :patient AND wa.woundLocation = :location ORDER BY wa.assessmentDate DESC")
    List<WoundAssessment> findLatestAssessmentByPatientAndLocation(@Param("patient") Patient patient, 
                                                                  @Param("location") String location);
    
    @Query("SELECT COUNT(wa) FROM WoundAssessment wa WHERE wa.assessmentDate >= :startDate AND wa.assessmentDate <= :endDate")
    Long countAssessmentsByDateRange(@Param("startDate") LocalDateTime startDate, 
                                    @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.patient = :patient AND wa.assessmentDate = (SELECT MAX(wa2.assessmentDate) FROM WoundAssessment wa2 WHERE wa2.patient = :patient)")
    Optional<WoundAssessment> findLatestAssessmentByPatient(@Param("patient") Patient patient);
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.aiConfidenceScore < :threshold")
    List<WoundAssessment> findAssessmentsWithLowAIConfidence(@Param("threshold") Double threshold);
    
    @Query("SELECT wa FROM WoundAssessment wa WHERE wa.patient = :patient AND wa.woundLocation = :location AND wa.assessmentDate >= :startDate ORDER BY wa.assessmentDate ASC")
    List<WoundAssessment> findAssessmentHistoryByPatientAndLocation(@Param("patient") Patient patient, 
                                                                   @Param("location") String location,
                                                                   @Param("startDate") LocalDateTime startDate);
}
