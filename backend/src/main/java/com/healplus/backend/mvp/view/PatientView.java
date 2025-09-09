package com.healplus.backend.mvp.view;

import com.healplus.backend.Model.Patient;
import java.util.List;
import java.util.UUID;

/**
 * Interface para a view de pacientes
 */
public interface PatientView extends View {
    
    /**
     * Exibe a lista de pacientes
     */
    void showPatients(List<Patient> patients);
    
    /**
     * Exibe os detalhes de um paciente
     */
    void showPatientDetails(Patient patient);
    
    /**
     * Exibe formulário para criar/editar paciente
     */
    void showPatientForm(Patient patient);
    
    /**
     * Remove um paciente da lista
     */
    void removePatient(UUID patientId);
    
    /**
     * Adiciona um novo paciente à lista
     */
    void addPatient(Patient patient);
    
    /**
     * Atualiza um paciente na lista
     */
    void updatePatient(Patient patient);
    
    /**
     * Navega para a tela de detalhes do paciente
     */
    void navigateToPatientDetails(UUID patientId);
    
    /**
     * Navega para a tela de edição do paciente
     */
    void navigateToEditPatient(UUID patientId);
}
