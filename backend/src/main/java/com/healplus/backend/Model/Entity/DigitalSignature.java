package com.healplus.backend.Model.Entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidade para gerenciar assinaturas digitais ICP-Brasil
 * Conformidade com Lei 13.787 - Prontuário Eletrônico
 */
@Entity
@Table(name = "digital_signatures")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DigitalSignature {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String documentId; // ID do documento assinado
    
    @Column(nullable = false)
    private String documentType; // Tipo do documento (WOUND_ASSESSMENT, APPOINTMENT, etc.)
    
    @Column(nullable = false)
    private String signerId; // ID do profissional que assinou
    
    @Column(nullable = false)
    private String signerName; // Nome do profissional
    
    @Column(nullable = false)
    private String signerCrm; // CRM do profissional
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String certificateData; // Dados do certificado digital
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String signatureData; // Dados da assinatura digital
    
    @Column(nullable = false)
    private String hashAlgorithm; // Algoritmo de hash (SHA-256, SHA-512)
    
    @Column(nullable = false)
    private String signatureAlgorithm; // Algoritmo de assinatura (RSA, ECDSA)
    
    @Column(nullable = false)
    private String documentHash; // Hash do documento antes da assinatura
    
    @Column(nullable = false)
    private String certificateSerial; // Número de série do certificado
    
    @Column(nullable = false)
    private String certificateIssuer; // Emissor do certificado
    
    @Column(nullable = false)
    private LocalDateTime certificateValidFrom; // Validade do certificado - início
    
    @Column(nullable = false)
    private LocalDateTime certificateValidTo; // Validade do certificado - fim
    
    @Column(nullable = false)
    private LocalDateTime signedAt; // Data/hora da assinatura
    
    @Column
    private LocalDateTime verifiedAt; // Data/hora da última verificação
    
    @Column
    private Boolean isValid = true; // Se a assinatura é válida
    
    @Column(length = 1000)
    private String verificationNotes; // Notas da verificação
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum SignatureStatus {
        VALID, INVALID, EXPIRED, REVOKED, PENDING_VERIFICATION
    }
}
