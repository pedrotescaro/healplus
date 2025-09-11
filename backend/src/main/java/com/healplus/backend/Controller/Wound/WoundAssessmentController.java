package com.healplus.backend.Controller.Wound;

import com.healplus.backend.Model.Entity.WoundAssessment;
import com.healplus.backend.Service.Wound.WoundAssessmentService;
import com.healplus.backend.Service.AI.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.UUID;

@RestController
@RequestMapping("/api/wound-assessments")
@CrossOrigin(origins = "*")
public class WoundAssessmentController {
    
    @Autowired
    private WoundAssessmentService woundAssessmentService;
    
    @Autowired
    private AIService aiService;
    
    /**
     * Obter todas as avaliações
     */
    @GetMapping
    public ResponseEntity<List<WoundAssessment>> getAllAssessments() {
        try {
            List<WoundAssessment> assessments = woundAssessmentService.getAllAssessments();
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter avaliação por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<WoundAssessment> getAssessmentById(@PathVariable UUID id) {
        try {
            WoundAssessment assessment = woundAssessmentService.getAssessmentById(id);
            return ResponseEntity.ok(assessment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter avaliações por paciente
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<WoundAssessment>> getAssessmentsByPatient(@PathVariable UUID patientId) {
        try {
            List<WoundAssessment> assessments = woundAssessmentService.getAssessmentsByPatient(patientId);
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter avaliações por profissional
     */
    @GetMapping("/professional/{professionalId}")
    public ResponseEntity<List<WoundAssessment>> getAssessmentsByProfessional(@PathVariable UUID professionalId) {
        try {
            List<WoundAssessment> assessments = woundAssessmentService.getAssessmentsByProfessional(professionalId);
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter avaliação mais recente por paciente
     */
    @GetMapping("/patient/{patientId}/latest")
    public ResponseEntity<WoundAssessment> getLatestAssessmentByPatient(@PathVariable UUID patientId) {
        try {
            WoundAssessment assessment = woundAssessmentService.getLatestAssessmentByPatient(patientId);
            return ResponseEntity.ok(assessment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Criar nova avaliação
     */
    @PostMapping
    public ResponseEntity<WoundAssessment> createAssessment(@Valid @RequestBody WoundAssessment assessment) {
        try {
            WoundAssessment createdAssessment = woundAssessmentService.createAssessment(assessment);
            return ResponseEntity.ok(createdAssessment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Atualizar avaliação
     */
    @PutMapping("/{id}")
    public ResponseEntity<WoundAssessment> updateAssessment(@PathVariable UUID id, @Valid @RequestBody WoundAssessment assessment) {
        try {
            WoundAssessment updatedAssessment = woundAssessmentService.updateAssessment(id, assessment);
            return ResponseEntity.ok(updatedAssessment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Deletar avaliação
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAssessment(@PathVariable UUID id) {
        try {
            woundAssessmentService.deleteAssessment(id);
            return ResponseEntity.ok("Avaliação deletada com sucesso");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Análise completa de ferida com IA
     */
    @PostMapping("/{id}/ai-analysis")
    public ResponseEntity<Map<String, Object>> performAIAnalysis(@PathVariable UUID id, @RequestParam("image") MultipartFile imageFile) {
        try {
            WoundAssessment assessment = woundAssessmentService.getAssessmentById(id);
            
            // Executar análise de IA de forma assíncrona
            CompletableFuture<com.healplus.backend.Model.Entity.AIAnalysis> analysisFuture = 
                aiService.analyzeWoundComprehensive(assessment, imageFile);
            
            // Retornar resposta imediata
            Map<String, Object> response = Map.of(
                "message", "Análise de IA iniciada",
                "assessmentId", id,
                "status", "processing"
            );
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter análises de IA por avaliação
     */
    @GetMapping("/{id}/ai-analyses")
      public ResponseEntity<List<com.healplus.backend.Model.Entity.AIAnalysis>> getAIAnalyses(@PathVariable UUID id) {
        try {
            WoundAssessment assessment = woundAssessmentService.getAssessmentById(id);
            List<com.healplus.backend.Model.Entity.AIAnalysis> analyses = aiService.getAnalysesByAssessment(assessment);
            return ResponseEntity.ok(analyses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter avaliações por nível de risco de infecção
     */
    @GetMapping("/infection-risk/{riskLevel}")
    public ResponseEntity<List<WoundAssessment>> getAssessmentsByInfectionRisk(@PathVariable String riskLevel) {
        try {
            WoundAssessment.InfectionRiskLevel risk = WoundAssessment.InfectionRiskLevel.valueOf(riskLevel.toUpperCase());
            List<WoundAssessment> assessments = woundAssessmentService.getAssessmentsByInfectionRisk(risk);
            return ResponseEntity.ok(assessments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter avaliações por trajetória de cicatrização
     */
    @GetMapping("/healing-trajectory/{trajectory}")
    public ResponseEntity<List<WoundAssessment>> getAssessmentsByHealingTrajectory(@PathVariable String trajectory) {
        try {
            WoundAssessment.HealingTrajectory healingTrajectory = WoundAssessment.HealingTrajectory.valueOf(trajectory.toUpperCase());
            List<WoundAssessment> assessments = woundAssessmentService.getAssessmentsByHealingTrajectory(healingTrajectory);
            return ResponseEntity.ok(assessments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter avaliações que necessitam terapia avançada
     */
    @GetMapping("/needs-advanced-therapy")
    public ResponseEntity<List<WoundAssessment>> getAssessmentsNeedingAdvancedTherapy() {
        try {
            List<WoundAssessment> assessments = woundAssessmentService.getAssessmentsNeedingAdvancedTherapy();
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter avaliações que necessitam encaminhamento
     */
    @GetMapping("/needs-specialist-referral")
    public ResponseEntity<List<WoundAssessment>> getAssessmentsNeedingSpecialistReferral() {
        try {
            List<WoundAssessment> assessments = woundAssessmentService.getAssessmentsNeedingSpecialistReferral();
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter histórico de avaliações por paciente e localização
     */
    @GetMapping("/patient/{patientId}/location/{location}")
    public ResponseEntity<List<WoundAssessment>> getAssessmentHistoryByPatientAndLocation(
            @PathVariable UUID patientId, @PathVariable String location) {
        try {
            List<WoundAssessment> assessments = woundAssessmentService.getAssessmentHistoryByPatientAndLocation(patientId, location);
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter estatísticas de avaliações
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getAssessmentStatistics() {
        try {
            Map<String, Object> statistics = woundAssessmentService.getAssessmentStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter avaliações por período
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<WoundAssessment>> getAssessmentsByDateRange(
            @RequestParam String startDate, @RequestParam String endDate) {
        try {
            List<WoundAssessment> assessments = woundAssessmentService.getAssessmentsByDateRange(startDate, endDate);
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Upload de imagem para avaliação
     */
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<Map<String, Object>> uploadImage(@PathVariable UUID id, @RequestParam("image") MultipartFile imageFile) {
        try {
            WoundAssessment assessment = woundAssessmentService.getAssessmentById(id);
            Map<String, Object> result = woundAssessmentService.uploadImage(assessment, imageFile);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Obter imagens de uma avaliação
     */
    @GetMapping("/{id}/images")
      public ResponseEntity<List<com.healplus.backend.Model.Entity.WoundImage>> getAssessmentImages(@PathVariable UUID id) {
        try {
            WoundAssessment assessment = woundAssessmentService.getAssessmentById(id);
            List<com.healplus.backend.Model.Entity.WoundImage> images = woundAssessmentService.getAssessmentImages(assessment);
            return ResponseEntity.ok(images);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
