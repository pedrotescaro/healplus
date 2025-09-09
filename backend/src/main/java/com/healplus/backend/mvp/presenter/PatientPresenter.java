package com.healplus.backend.mvp.presenter;

import com.healplus.backend.Model.Patient;
import com.healplus.backend.Service.PatientService;
import com.healplus.backend.mvp.view.PatientView;
import com.healplus.backend.security.service.AuditService;
import com.healplus.backend.security.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

/**
 * Presenter para gerenciar a lógica de negócio dos pacientes
 */
@Component
public class PatientPresenter extends BasePresenter<PatientView> {
    
    @Autowired
    private PatientService patientService;
    
    @Autowired
    private SecurityService securityService;
    
    @Autowired
    private AuditService auditService;
    
    /**
     * Carrega todos os pacientes
     */
    public void loadPatients() {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                List<Patient> patients = patientService.getAllPatients();
                view.showPatients(patients);
                
                // Auditoria
                auditService.logResourceAccess(securityService.getCurrentUser(), 
                    "PATIENTS", "LOAD_ALL");
                    
            } catch (Exception e) {
                view.showError("Erro ao carregar pacientes: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Carrega um paciente específico
     */
    public void loadPatient(UUID patientId) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                Patient patient = patientService.getPatientById(patientId);
                view.showPatientDetails(patient);
                
                // Auditoria
                auditService.logResourceAccess(securityService.getCurrentUser(), 
                    "PATIENT", "VIEW_DETAILS");
                    
            } catch (Exception e) {
                view.showError("Erro ao carregar paciente: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Cria um novo paciente
     */
    public void createPatient(Patient patient) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                Patient createdPatient = patientService.createPatient(patient);
                view.addPatient(createdPatient);
                view.showSuccess("Paciente criado com sucesso!");
                
                // Auditoria
                auditService.logSensitiveOperation(securityService.getCurrentUser(), 
                    "CREATE_PATIENT", "Patient created: " + createdPatient.getId());
                    
            } catch (Exception e) {
                view.showError("Erro ao criar paciente: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Atualiza um paciente existente
     */
    public void updatePatient(UUID patientId, Patient patient) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                Patient updatedPatient = patientService.updatePatient(patientId, patient);
                view.updatePatient(updatedPatient);
                view.showSuccess("Paciente atualizado com sucesso!");
                
                // Auditoria
                auditService.logSensitiveOperation(securityService.getCurrentUser(), 
                    "UPDATE_PATIENT", "Patient updated: " + patientId);
                    
            } catch (Exception e) {
                view.showError("Erro ao atualizar paciente: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Exclui um paciente
     */
    public void deletePatient(UUID patientId) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                patientService.deletePatient(patientId);
                view.removePatient(patientId);
                view.showSuccess("Paciente excluído com sucesso!");
                
                // Auditoria
                auditService.logSensitiveOperation(securityService.getCurrentUser(), 
                    "DELETE_PATIENT", "Patient deleted: " + patientId);
                    
            } catch (Exception e) {
                view.showError("Erro ao excluir paciente: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Navega para editar um paciente
     */
    public void editPatient(UUID patientId) {
        ifViewAttached(view -> {
            try {
                Patient patient = patientService.getPatientById(patientId);
                view.showPatientForm(patient);
                view.navigateToEditPatient(patientId);
            } catch (Exception e) {
                view.showError("Erro ao carregar paciente para edição: " + e.getMessage());
            }
        });
    }
}
