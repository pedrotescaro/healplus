package com.healplus.backend.mvp.presenter;

import com.healplus.backend.Model.WoundAssessment;
import com.healplus.backend.Service.WoundAssessmentService;
import com.healplus.backend.mvp.view.WoundAssessmentView;
import com.healplus.backend.security.service.AuditService;
import com.healplus.backend.security.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

/**
 * Presenter para gerenciar a lógica de negócio das avaliações de feridas
 */
@Component
public class WoundAssessmentPresenter extends BasePresenter<WoundAssessmentView> {
    
    @Autowired
    private WoundAssessmentService woundAssessmentService;
    
    @Autowired
    private SecurityService securityService;
    
    @Autowired
    private AuditService auditService;
    
    /**
     * Carrega todas as avaliações
     */
    public void loadAssessments() {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                List<WoundAssessment> assessments = woundAssessmentService.getAllAssessments();
                view.showAssessments(assessments);
                
                // Auditoria
                auditService.logResourceAccess(securityService.getCurrentUser(), 
                    "WOUND_ASSESSMENTS", "LOAD_ALL");
                    
            } catch (Exception e) {
                view.showError("Erro ao carregar avaliações: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Carrega avaliações de um paciente específico
     */
    public void loadAssessmentsByPatient(UUID patientId) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                List<WoundAssessment> assessments = woundAssessmentService.getAssessmentsByPatientId(patientId);
                view.showAssessments(assessments);
                
                // Auditoria
                auditService.logResourceAccess(securityService.getCurrentUser(), 
                    "WOUND_ASSESSMENTS", "LOAD_BY_PATIENT");
                    
            } catch (Exception e) {
                view.showError("Erro ao carregar avaliações do paciente: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Carrega uma avaliação específica
     */
    public void loadAssessment(UUID assessmentId) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                WoundAssessment assessment = woundAssessmentService.getAssessmentById(assessmentId);
                view.showAssessmentDetails(assessment);
                
                // Auditoria
                auditService.logResourceAccess(securityService.getCurrentUser(), 
                    "WOUND_ASSESSMENT", "VIEW_DETAILS");
                    
            } catch (Exception e) {
                view.showError("Erro ao carregar avaliação: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Cria uma nova avaliação
     */
    public void createAssessment(WoundAssessment assessment) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                WoundAssessment createdAssessment = woundAssessmentService.createAssessment(assessment);
                view.addAssessment(createdAssessment);
                view.showSuccess("Avaliação criada com sucesso!");
                
                // Auditoria
                auditService.logSensitiveOperation(securityService.getCurrentUser(), 
                    "CREATE_ASSESSMENT", "Assessment created: " + createdAssessment.getId());
                    
            } catch (Exception e) {
                view.showError("Erro ao criar avaliação: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Atualiza uma avaliação existente
     */
    public void updateAssessment(UUID assessmentId, WoundAssessment assessment) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                WoundAssessment updatedAssessment = woundAssessmentService.updateAssessment(assessmentId, assessment);
                view.updateAssessment(updatedAssessment);
                view.showSuccess("Avaliação atualizada com sucesso!");
                
                // Auditoria
                auditService.logSensitiveOperation(securityService.getCurrentUser(), 
                    "UPDATE_ASSESSMENT", "Assessment updated: " + assessmentId);
                    
            } catch (Exception e) {
                view.showError("Erro ao atualizar avaliação: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Exclui uma avaliação
     */
    public void deleteAssessment(UUID assessmentId) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                woundAssessmentService.deleteAssessment(assessmentId);
                view.removeAssessment(assessmentId);
                view.showSuccess("Avaliação excluída com sucesso!");
                
                // Auditoria
                auditService.logSensitiveOperation(securityService.getCurrentUser(), 
                    "DELETE_ASSESSMENT", "Assessment deleted: " + assessmentId);
                    
            } catch (Exception e) {
                view.showError("Erro ao excluir avaliação: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
    
    /**
     * Gera análise de IA para uma avaliação
     */
    public void generateAIAnalysis(UUID assessmentId) {
        ifViewAttached(view -> {
            view.showLoading();
            try {
                String analysis = woundAssessmentService.generateAIAnalysis(assessmentId);
                view.showAIAnalysis(analysis);
                view.showSuccess("Análise de IA gerada com sucesso!");
                
                // Auditoria
                auditService.logSensitiveOperation(securityService.getCurrentUser(), 
                    "AI_ANALYSIS", "AI analysis generated for assessment: " + assessmentId);
                    
            } catch (Exception e) {
                view.showError("Erro ao gerar análise de IA: " + e.getMessage());
            } finally {
                view.hideLoading();
            }
        });
    }
}
