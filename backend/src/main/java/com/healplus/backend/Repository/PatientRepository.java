package com.healplus.backend.Repository;

import com.healplus.backend.Model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {
    
    Optional<Patient> findByEmail(String email);
    
    Optional<Patient> findByCpf(String cpf);
    
    List<Patient> findByNameContainingIgnoreCase(String name);
    
    List<Patient> findByCity(String city);
    
    List<Patient> findByState(String state);
    
    @Query("SELECT p FROM Patient p WHERE p.hasDiabetes = true")
    List<Patient> findPatientsWithDiabetes();
    
    @Query("SELECT p FROM Patient p WHERE p.hasHypertension = true")
    List<Patient> findPatientsWithHypertension();
    
    @Query("SELECT p FROM Patient p WHERE p.hasCardiovascularDisease = true")
    List<Patient> findPatientsWithCardiovascularDisease();
    
    @Query("SELECT p FROM Patient p WHERE p.hasPeripheralVascularDisease = true")
    List<Patient> findPatientsWithPeripheralVascularDisease();
    
    @Query("SELECT p FROM Patient p WHERE p.hasSmokingHistory = true")
    List<Patient> findPatientsWithSmokingHistory();
    
    @Query("SELECT p FROM Patient p WHERE p.createdAt >= :startDate")
    List<Patient> findPatientsCreatedAfter(@Param("startDate") java.time.LocalDateTime startDate);
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate")
    Long countPatientsByDateRange(@Param("startDate") java.time.LocalDateTime startDate, 
                                  @Param("endDate") java.time.LocalDateTime endDate);
    
    @Query("SELECT p FROM Patient p WHERE p.city = :city AND p.state = :state")
    List<Patient> findPatientsByLocation(@Param("city") String city, @Param("state") String state);
    
    @Query("SELECT DISTINCT p.city FROM Patient p ORDER BY p.city")
    List<String> findAllCities();
    
    @Query("SELECT DISTINCT p.state FROM Patient p ORDER BY p.state")
    List<String> findAllStates();
}
