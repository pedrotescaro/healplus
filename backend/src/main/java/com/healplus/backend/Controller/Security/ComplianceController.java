package com.healplus.backend.Controller;

import com.healplus.backend.Model.DigitalSignature;
import com.healplus.backend.Service.Security.DigitalSignatureService;
import com.healplus.backend.Service.Security.DataRetentionService;
import com.healplus.backend.Service.Security.BackupService;
import com.healplus.backend.Service.Security.IntegrityVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Controller para funcionalidades de conformidade com Lei 13.787
 * Prontuário Eletrônico
 */
@RestController
@RequestMapping("/api/compliance")
@RequiredArgsConstructor
public class ComplianceController {
    
    private final DigitalSignatureService digitalSignatureService;
    private final DataRetentionService dataRetentionService;
    private final BackupService backupService;
    private final IntegrityVerificationService integrityVerificationService;
    
    /**
     * Assinar documento digitalmente
     */
    @PostMapping("/sign")
    @PreAuthorize("hasRole('CLINICIAN') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> signDocument(@RequestBody SignDocumentRequest request) {
        try {
            DigitalSignature signature = digitalSignatureService.signDocument(
                request.getDocumentId(),
                request.getDocumentType(),
                request.getSignerId(),
                request.getSignerName(),
                request.getSignerCrm(),
                request.getDocumentContent(),
                request.getCertificateData()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Documento assinado com sucesso",
                "signatureId", signature.getId(),
                "signedAt", signature.getSignedAt()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erro ao assinar documento: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Verificar assinatura digital
     */
    @GetMapping("/verify/{documentId}")
    @PreAuthorize("hasRole('CLINICIAN') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> verifySignature(@PathVariable String documentId,
                                                              @RequestParam String documentContent) {
        try {
            boolean isValid = digitalSignatureService.verifySignature(documentId, documentContent);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "isValid", isValid,
                "message", isValid ? "Assinatura válida" : "Assinatura inválida"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erro ao verificar assinatura: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Registrar dados para retenção
     */
    @PostMapping("/retention/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> registerDataRetention(@RequestBody RegisterRetentionRequest request) {
        try {
            var retention = dataRetentionService.registerDataRetention(
                request.getEntityType(),
                request.getEntityId(),
                request.getCreatedAt(),
                request.getRetentionDays()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Dados registrados para retenção",
                "retentionId", retention.getId(),
                "retentionUntil", retention.getRetentionUntil()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erro ao registrar retenção: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Executar backup manual
     */
    @PostMapping("/backup/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createBackup(@RequestBody CreateBackupRequest request) {
        try {
            String backupLocation = backupService.createBackup(
                request.getEntityType(),
                request.getEntityId()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Backup criado com sucesso",
                "backupLocation", backupLocation
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erro ao criar backup: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Verificar integridade de dados
     */
    @PostMapping("/integrity/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> verifyIntegrity(@RequestBody VerifyIntegrityRequest request) {
        try {
            boolean isValid = integrityVerificationService.forceIntegrityVerification(
                request.getEntityType(),
                request.getEntityId()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "isValid", isValid,
                "message", isValid ? "Integridade verificada" : "Problemas de integridade detectados"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erro ao verificar integridade: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Obter estatísticas de conformidade
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getComplianceStatistics() {
        try {
            var retentionStats = dataRetentionService.getRetentionStatistics();
            var integrityStats = integrityVerificationService.getIntegrityStatistics();
            var backups = backupService.listBackups();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "retention", Map.of(
                    "totalRecords", retentionStats.getTotalRecords(),
                    "backedUpRecords", retentionStats.getBackedUpRecords(),
                    "pendingDeletion", retentionStats.getPendingDeletion(),
                    "deletedRecords", retentionStats.getDeletedRecords()
                ),
                "integrity", Map.of(
                    "totalRecords", integrityStats.getTotalRecords(),
                    "verifiedRecords", integrityStats.getVerifiedRecords(),
                    "failedRecords", integrityStats.getFailedRecords(),
                    "integrityPercentage", integrityStats.getIntegrityPercentage()
                ),
                "backups", Map.of(
                    "totalBackups", backups.size(),
                    "backups", backups
                )
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erro ao obter estatísticas: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Listar backups disponíveis
     */
    @GetMapping("/backups")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> listBackups() {
        try {
            var backups = backupService.listBackups();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "backups", backups
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erro ao listar backups: " + e.getMessage()
            ));
        }
    }
    
    // Classes de request
    public static class SignDocumentRequest {
        private String documentId;
        private String documentType;
        private String signerId;
        private String signerName;
        private String signerCrm;
        private String documentContent;
        private String certificateData;
        
        // Getters e setters
        public String getDocumentId() { return documentId; }
        public void setDocumentId(String documentId) { this.documentId = documentId; }
        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }
        public String getSignerId() { return signerId; }
        public void setSignerId(String signerId) { this.signerId = signerId; }
        public String getSignerName() { return signerName; }
        public void setSignerName(String signerName) { this.signerName = signerName; }
        public String getSignerCrm() { return signerCrm; }
        public void setSignerCrm(String signerCrm) { this.signerCrm = signerCrm; }
        public String getDocumentContent() { return documentContent; }
        public void setDocumentContent(String documentContent) { this.documentContent = documentContent; }
        public String getCertificateData() { return certificateData; }
        public void setCertificateData(String certificateData) { this.certificateData = certificateData; }
    }
    
    public static class RegisterRetentionRequest {
        private String entityType;
        private String entityId;
        private LocalDateTime createdAt;
        private Integer retentionDays;
        
        // Getters e setters
        public String getEntityType() { return entityType; }
        public void setEntityType(String entityType) { this.entityType = entityType; }
        public String getEntityId() { return entityId; }
        public void setEntityId(String entityId) { this.entityId = entityId; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public Integer getRetentionDays() { return retentionDays; }
        public void setRetentionDays(Integer retentionDays) { this.retentionDays = retentionDays; }
    }
    
    public static class CreateBackupRequest {
        private String entityType;
        private String entityId;
        
        // Getters e setters
        public String getEntityType() { return entityType; }
        public void setEntityType(String entityType) { this.entityType = entityType; }
        public String getEntityId() { return entityId; }
        public void setEntityId(String entityId) { this.entityId = entityId; }
    }
    
    public static class VerifyIntegrityRequest {
        private String entityType;
        private String entityId;
        
        // Getters e setters
        public String getEntityType() { return entityType; }
        public void setEntityType(String entityType) { this.entityType = entityType; }
        public String getEntityId() { return entityId; }
        public void setEntityId(String entityId) { this.entityId = entityId; }
    }
}
