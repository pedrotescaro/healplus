package com.healplus.backend.Repository;

import com.healplus.backend.Model.Clinician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClinicianRepository extends JpaRepository<Clinician, UUID> {
    
    Optional<Clinician> findByEmail(String email);
    
    Optional<Clinician> findByCrm(String crm);
    
    List<Clinician> findByNameContainingIgnoreCase(String name);
    
    List<Clinician> findByClinicianType(Clinician.ClinicianType clinicianType);
    
    List<Clinician> findBySpecializationContainingIgnoreCase(String specialization);
    
    List<Clinician> findByIsActiveTrue();
    
    List<Clinician> findByIsAvailableForTelehealthTrue();
    
    @Query("SELECT c FROM Clinician c WHERE c.city = :city AND c.isActive = true")
    List<Clinician> findActiveCliniciansByCity(@Param("city") String city);
    
    @Query("SELECT c FROM Clinician c WHERE c.state = :state AND c.isActive = true")
    List<Clinician> findActiveCliniciansByState(@Param("state") String state);
    
    @Query("SELECT c FROM Clinician c WHERE c.clinicianType = :type AND c.isActive = true")
    List<Clinician> findActiveCliniciansByType(@Param("type") Clinician.ClinicianType type);
    
    @Query("SELECT c FROM Clinician c WHERE c.specialization LIKE %:specialization% AND c.isActive = true")
    List<Clinician> findActiveCliniciansBySpecialization(@Param("specialization") String specialization);
    
    @Query("SELECT c FROM Clinician c WHERE c.yearsOfExperience >= :minExperience AND c.isActive = true")
    List<Clinician> findActiveCliniciansByMinExperience(@Param("minExperience") Integer minExperience);
    
    @Query("SELECT c FROM Clinician c WHERE c.isAvailableForTelehealth = true AND c.isActive = true")
    List<Clinician> findAvailableTelehealthClinicians();
    
    @Query("SELECT DISTINCT c.specialization FROM Clinician c WHERE c.isActive = true ORDER BY c.specialization")
    List<String> findAllSpecializations();
    
    @Query("SELECT DISTINCT c.city FROM Clinician c WHERE c.isActive = true ORDER BY c.city")
    List<String> findAllCities();
    
    @Query("SELECT DISTINCT c.state FROM Clinician c WHERE c.isActive = true ORDER BY c.state")
    List<String> findAllStates();
    
    @Query("SELECT COUNT(c) FROM Clinician c WHERE c.isActive = true")
    Long countActiveClinicians();
    
    @Query("SELECT COUNT(c) FROM Clinician c WHERE c.isAvailableForTelehealth = true AND c.isActive = true")
    Long countAvailableTelehealthClinicians();
}
