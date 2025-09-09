package com.healplus.backend.mvp.view;

import com.healplus.backend.Model.Patient;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

/**
 * Implementação da view para o controller de pacientes
 */
public class PatientControllerView implements PatientView {
    
    private ResponseEntity<?> response;
    
    @Override
    public void showPatients(List<Patient> patients) {
        this.response = ResponseEntity.ok(patients);
    }
    
    @Override
    public void showPatientDetails(Patient patient) {
        this.response = ResponseEntity.ok(patient);
    }
    
    @Override
    public void showPatientForm(Patient patient) {
        this.response = ResponseEntity.ok(patient);
    }
    
    @Override
    public void removePatient(UUID patientId) {
        this.response = ResponseEntity.ok("Paciente removido com sucesso");
    }
    
    @Override
    public void addPatient(Patient patient) {
        this.response = ResponseEntity.ok(patient);
    }
    
    @Override
    public void updatePatient(Patient patient) {
        this.response = ResponseEntity.ok(patient);
    }
    
    @Override
    public void navigateToPatientDetails(UUID patientId) {
        // Implementação específica para navegação
    }
    
    @Override
    public void navigateToEditPatient(UUID patientId) {
        // Implementação específica para navegação
    }
    
    @Override
    public void showSuccess(String message) {
        this.response = ResponseEntity.ok(message);
    }
    
    @Override
    public void showError(String message) {
        this.response = ResponseEntity.badRequest().body(message);
    }
    
    @Override
    public void showInfo(String message) {
        this.response = ResponseEntity.ok(message);
    }
    
    @Override
    public void showLoading() {
        // Para controllers, não precisamos mostrar loading
    }
    
    @Override
    public void hideLoading() {
        // Para controllers, não precisamos esconder loading
    }
    
    public ResponseEntity<?> getResponse() {
        return response;
    }
}
