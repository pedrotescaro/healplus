package com.healplus.backend.Controller;

import com.healplus.backend.Model.WoundAssessment;
import com.healplus.backend.mvp.presenter.WoundAssessmentPresenter;
import com.healplus.backend.mvp.view.WoundAssessmentView;
import com.healplus.backend.security.annotation.RateLimited;
import com.healplus.backend.security.annotation.RequireRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

/**
 * Controller MVP para gerenciar avaliações de feridas
 */
@RestController
@RequestMapping("/api/mvp/assessments")
@CrossOrigin(origins = "*")
@RateLimited(requests = 300, windowMinutes = 60)
public class MvpWoundAssessmentController {
    
    @Autowired
    private WoundAssessmentPresenter woundAssessmentPresenter;
    
    /**
     * Obter todas as avaliações
     */
    @GetMapping
    @RequireRole({"CLINICIAN", "ADMIN"})
    public ResponseEntity<?> getAllAssessments() {
        WoundAssessmentView view = new WoundAssessmentControllerView();
        woundAssessmentPresenter.attachView(view);
        woundAssessmentPresenter.loadAssessments();
        return view.getResponse();
    }
    
    /**
     * Obter avaliação por ID
     */
    @GetMapping("/{id}")
    @RequireRole({"PATIENT", "CLINICIAN", "ADMIN"})
    public ResponseEntity<?> getAssessmentById(@PathVariable UUID id) {
        WoundAssessmentView view = new WoundAssessmentControllerView();
        woundAssessmentPresenter.attachView(view);
        woundAssessmentPresenter.loadAssessment(id);
        return view.getResponse();
    }
    
    /**
     * Obter avaliações por paciente
     */
    @GetMapping("/patient/{patientId}")
    @RequireRole({"PATIENT", "CLINICIAN", "ADMIN"})
    public ResponseEntity<?> getAssessmentsByPatient(@PathVariable UUID patientId) {
        WoundAssessmentView view = new WoundAssessmentControllerView();
        woundAssessmentPresenter.attachView(view);
        woundAssessmentPresenter.loadAssessmentsByPatient(patientId);
        return view.getResponse();
    }
    
    /**
     * Criar nova avaliação
     */
    @PostMapping
    @RequireRole({"CLINICIAN", "ADMIN"})
    @RateLimited(requests = 100, windowMinutes = 60)
    public ResponseEntity<?> createAssessment(@Valid @RequestBody WoundAssessment assessment) {
        WoundAssessmentView view = new WoundAssessmentControllerView();
        woundAssessmentPresenter.attachView(view);
        woundAssessmentPresenter.createAssessment(assessment);
        return view.getResponse();
    }
    
    /**
     * Atualizar avaliação
     */
    @PutMapping("/{id}")
    @RequireRole({"CLINICIAN", "ADMIN"})
    public ResponseEntity<?> updateAssessment(@PathVariable UUID id, @Valid @RequestBody WoundAssessment assessment) {
        WoundAssessmentView view = new WoundAssessmentControllerView();
        woundAssessmentPresenter.attachView(view);
        woundAssessmentPresenter.updateAssessment(id, assessment);
        return view.getResponse();
    }
    
    /**
     * Deletar avaliação
     */
    @DeleteMapping("/{id}")
    @RequireRole({"ADMIN"})
    @RateLimited(requests = 20, windowMinutes = 60)
    public ResponseEntity<?> deleteAssessment(@PathVariable UUID id) {
        WoundAssessmentView view = new WoundAssessmentControllerView();
        woundAssessmentPresenter.attachView(view);
        woundAssessmentPresenter.deleteAssessment(id);
        return view.getResponse();
    }
    
    /**
     * Gerar análise de IA
     */
    @PostMapping("/{id}/ai-analysis")
    @RequireRole({"CLINICIAN", "ADMIN"})
    @RateLimited(requests = 50, windowMinutes = 60)
    public ResponseEntity<?> generateAIAnalysis(@PathVariable UUID id) {
        WoundAssessmentView view = new WoundAssessmentControllerView();
        woundAssessmentPresenter.attachView(view);
        woundAssessmentPresenter.generateAIAnalysis(id);
        return view.getResponse();
    }
    
    /**
     * Implementação da view para o controller
     */
    private static class WoundAssessmentControllerView implements WoundAssessmentView {
        private ResponseEntity<?> response;
        
        @Override
        public void showAssessments(List<WoundAssessment> assessments) {
            this.response = ResponseEntity.ok(assessments);
        }
        
        @Override
        public void showAssessmentDetails(WoundAssessment assessment) {
            this.response = ResponseEntity.ok(assessment);
        }
        
        @Override
        public void showAssessmentForm(WoundAssessment assessment) {
            this.response = ResponseEntity.ok(assessment);
        }
        
        @Override
        public void removeAssessment(UUID assessmentId) {
            this.response = ResponseEntity.ok("Avaliação removida com sucesso");
        }
        
        @Override
        public void addAssessment(WoundAssessment assessment) {
            this.response = ResponseEntity.ok(assessment);
        }
        
        @Override
        public void updateAssessment(WoundAssessment assessment) {
            this.response = ResponseEntity.ok(assessment);
        }
        
        @Override
        public void navigateToAssessmentDetails(UUID assessmentId) {
            // Implementação específica para navegação
        }
        
        @Override
        public void navigateToEditAssessment(UUID assessmentId) {
            // Implementação específica para navegação
        }
        
        @Override
        public void showAIAnalysis(String analysis) {
            this.response = ResponseEntity.ok(analysis);
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
}
