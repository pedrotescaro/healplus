package com.healplus.backend.Model.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidade para gerenciar retenção e descarte de dados
 * Conformidade com Lei 13.787 - Prontuário Eletrônico
 */
@Entity
@Table(name = "data_retention")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DataRetention {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String entityType; // Tipo da entidade (Patient, WoundAssessment, etc.)
    
    @Column(nullable = false)
    private String entityId; // ID da entidade
    
    @Column(nullable = false)
    private LocalDateTime createdAt; // Data de criação do registro
    
    @Column(nullable = false)
    private LocalDateTime retentionUntil; // Data limite para retenção
    
    @Column
    private LocalDateTime lastBackupAt; // Data do último backup
    
    @Column
    private String backupLocation; // Localização do backup
    
    @Column
    private String backupHash; // Hash do backup para verificação
    
    @Column
    private Boolean isBackedUp = false; // Se foi feito backup
    
    @Column
    private Boolean isArchived = false; // Se foi arquivado
    
    @Column
    private Boolean isMarkedForDeletion = false; // Se está marcado para exclusão
    
    @Column
    private LocalDateTime markedForDeletionAt; // Quando foi marcado para exclusão
    
    @Column
    private String deletionReason; // Motivo da exclusão
    
    @Column
    private Boolean isDeleted = false; // Se foi deletado
    
    @Column
    private LocalDateTime deletedAt; // Quando foi deletado
    
    @Column
    private String deletedBy; // Quem deletou
    
    @Column
    private Integer retentionDays; // Dias de retenção (padrão 2555 = 7 anos)
    
    @Column
    private String legalBasis; // Base legal para retenção (Lei 13.787, LGPD, etc.)
    
    @Column
    private Boolean requiresSpecialHandling = false; // Se requer tratamento especial
    
    @Column(length = 1000)
    private String specialHandlingNotes; // Notas sobre tratamento especial
    
    @Column
    private LocalDateTime lastVerifiedAt; // Data da última verificação de integridade
    
    @Column
    private Boolean integrityVerified = true; // Se a integridade foi verificada
    
    @Column
    private String verificationHash; // Hash para verificação de integridade
    
    @Column(nullable = false)
    private LocalDateTime recordCreatedAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime recordUpdatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        recordUpdatedAt = LocalDateTime.now();
    }
    
    public enum RetentionStatus {
        ACTIVE, PENDING_BACKUP, BACKED_UP, ARCHIVED, PENDING_DELETION, DELETED
    }
    
    public enum LegalBasis {
        LEI_13787, LGPD, ANVISA, MEDICAL_RECORDS, CONSENT
    }
}
