package com.healplus.backend.Repository;

import com.healplus.backend.Model.Professional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfessionalRepository extends JpaRepository<Professional, UUID> {
    
    Optional<Professional> findByEmail(String email);
    
    Optional<Professional> findByCrm(String crm);
    
    List<Professional> findByNameContainingIgnoreCase(String name);
    
    List<Professional> findByProfessionalType(Professional.ProfessionalType professionalType);
    
    List<Professional> findBySpecializationContainingIgnoreCase(String specialization);
    
    List<Professional> findByIsActiveTrue();
    
    List<Professional> findByIsAvailableForTelehealthTrue();
    
    @Query("SELECT p FROM Professional p WHERE p.city = :city AND p.isActive = true")
    List<Professional> findActiveProfessionalsByCity(@Param("city") String city);
    
    @Query("SELECT p FROM Professional p WHERE p.state = :state AND p.isActive = true")
    List<Professional> findActiveProfessionalsByState(@Param("state") String state);
    
    @Query("SELECT p FROM Professional p WHERE p.professionalType = :type AND p.isActive = true")
    List<Professional> findActiveProfessionalsByType(@Param("type") Professional.ProfessionalType type);
    
    @Query("SELECT p FROM Professional p WHERE p.specialization LIKE %:specialization% AND p.isActive = true")
    List<Professional> findActiveProfessionalsBySpecialization(@Param("specialization") String specialization);
    
    @Query("SELECT p FROM Professional p WHERE p.yearsOfExperience >= :minExperience AND p.isActive = true")
    List<Professional> findActiveProfessionalsByMinExperience(@Param("minExperience") Integer minExperience);
    
    @Query("SELECT p FROM Professional p WHERE p.isAvailableForTelehealth = true AND p.isActive = true")
    List<Professional> findAvailableTelehealthProfessionals();
    
    @Query("SELECT DISTINCT p.specialization FROM Professional p WHERE p.isActive = true ORDER BY p.specialization")
    List<String> findAllSpecializations();
    
    @Query("SELECT DISTINCT p.city FROM Professional p WHERE p.isActive = true ORDER BY p.city")
    List<String> findAllCities();
    
    @Query("SELECT DISTINCT p.state FROM Professional p WHERE p.isActive = true ORDER BY p.state")
    List<String> findAllStates();
    
    @Query("SELECT COUNT(p) FROM Professional p WHERE p.isActive = true")
    Long countActiveProfessionals();
    
    @Query("SELECT COUNT(p) FROM Professional p WHERE p.isAvailableForTelehealth = true AND p.isActive = true")
    Long countAvailableTelehealthProfessionals();
}
