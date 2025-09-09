package com.healplus.backend.Repository;

import com.healplus.backend.Model.Appointment;
import com.healplus.backend.Model.Patient;
import com.healplus.backend.Model.Clinician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    
    List<Appointment> findByPatient(Patient patient);
    
    List<Appointment> findByClinician(Clinician clinician);
    
    List<Appointment> findByPatientOrderByScheduledDateTimeDesc(Patient patient);
    
    List<Appointment> findByClinicianOrderByScheduledDateTimeDesc(Clinician clinician);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.status = :status")
    List<Appointment> findByPatientAndStatus(@Param("patient") Patient patient, 
                                           @Param("status") Appointment.AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.clinician = :clinician AND a.status = :status")
    List<Appointment> findByClinicianAndStatus(@Param("clinician") Clinician clinician, 
                                             @Param("status") Appointment.AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.scheduledDateTime >= :startDate AND a.scheduledDateTime <= :endDate")
    List<Appointment> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.clinician = :clinician AND a.scheduledDateTime >= :startDate AND a.scheduledDateTime <= :endDate")
    List<Appointment> findByClinicianAndDateRange(@Param("clinician") Clinician clinician,
                                                 @Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.scheduledDateTime >= :startDate AND a.scheduledDateTime <= :endDate")
    List<Appointment> findByPatientAndDateRange(@Param("patient") Patient patient,
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentType = :type")
    List<Appointment> findByAppointmentType(@Param("type") Appointment.AppointmentType type);
    
    @Query("SELECT a FROM Appointment a WHERE a.status = :status")
    List<Appointment> findByStatus(@Param("status") Appointment.AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.isRecurring = true")
    List<Appointment> findRecurringAppointments();
    
    @Query("SELECT a FROM Appointment a WHERE a.clinician = :clinician AND a.scheduledDateTime = :dateTime")
    Optional<Appointment> findByClinicianAndDateTime(@Param("clinician") Clinician clinician, 
                                                    @Param("dateTime") LocalDateTime dateTime);
    
    @Query("SELECT a FROM Appointment a WHERE a.scheduledDateTime >= :startTime AND a.scheduledDateTime <= :endTime AND a.status IN ('SCHEDULED', 'CONFIRMED')")
    List<Appointment> findConflictingAppointments(@Param("startTime") LocalDateTime startTime, 
                                                 @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status AND a.scheduledDateTime >= :startDate AND a.scheduledDateTime <= :endDate")
    Long countAppointmentsByStatusAndDateRange(@Param("status") Appointment.AppointmentStatus status,
                                              @Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.reminderSentAt IS NULL AND a.scheduledDateTime <= :reminderTime AND a.status IN ('SCHEDULED', 'CONFIRMED')")
    List<Appointment> findAppointmentsNeedingReminder(@Param("reminderTime") LocalDateTime reminderTime);
}
