package com.healplus.backend.Service;

import com.healplus.backend.Model.DigitalSignature;
import com.healplus.backend.Repository.Security.DigitalSignatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.*;
import java.security.cert.X509Certificate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Serviço para gerenciar assinaturas digitais ICP-Brasil
 * Conformidade com Lei 13.787 - Prontuário Eletrônico
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DigitalSignatureService {
    
    private final DigitalSignatureRepository digitalSignatureRepository;
    
    /**
     * Assinar documento digitalmente
     */
    public DigitalSignature signDocument(String documentId, String documentType, 
                                       String signerId, String signerName, String signerCrm,
                                       String documentContent, String certificateData) {
        try {
            // Gerar hash do documento
            String documentHash = generateDocumentHash(documentContent);
            
            // Simular assinatura digital (em produção, usar certificado ICP-Brasil real)
            String signatureData = generateDigitalSignature(documentHash, certificateData);
            
            // Criar registro de assinatura
            DigitalSignature signature = new DigitalSignature();
            signature.setDocumentId(documentId);
            signature.setDocumentType(documentType);
            signature.setSignerId(signerId);
            signature.setSignerName(signerName);
            signature.setSignerCrm(signerCrm);
            signature.setCertificateData(certificateData);
            signature.setSignatureData(signatureData);
            signature.setHashAlgorithm("SHA-256");
            signature.setSignatureAlgorithm("RSA");
            signature.setDocumentHash(documentHash);
            signature.setCertificateSerial("ICP-BRASIL-" + UUID.randomUUID().toString().substring(0, 8));
            signature.setCertificateIssuer("Autoridade Certificadora ICP-Brasil");
            signature.setCertificateValidFrom(LocalDateTime.now().minusYears(1));
            signature.setCertificateValidTo(LocalDateTime.now().plusYears(2));
            signature.setSignedAt(LocalDateTime.now());
            signature.setIsValid(true);
            
            return digitalSignatureRepository.save(signature);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao assinar documento: " + e.getMessage(), e);
        }
    }
    
    /**
     * Verificar assinatura digital
     */
    public boolean verifySignature(String documentId, String documentContent) {
        try {
            Optional<DigitalSignature> signatureOpt = digitalSignatureRepository
                .findByDocumentIdAndDocumentType(documentId, "WOUND_ASSESSMENT");
            
            if (signatureOpt.isEmpty()) {
                return false;
            }
            
            DigitalSignature signature = signatureOpt.get();
            
            // Verificar se o certificado ainda é válido
            if (LocalDateTime.now().isAfter(signature.getCertificateValidTo())) {
                signature.setIsValid(false);
                signature.setVerificationNotes("Certificado expirado");
                digitalSignatureRepository.save(signature);
                return false;
            }
            
            // Gerar hash do documento atual
            String currentHash = generateDocumentHash(documentContent);
            
            // Verificar se o hash coincide
            boolean hashMatches = currentHash.equals(signature.getDocumentHash());
            
            // Simular verificação de assinatura (em produção, usar biblioteca ICP-Brasil)
            boolean signatureValid = verifyDigitalSignature(signature.getSignatureData(), 
                                                          signature.getDocumentHash(), 
                                                          signature.getCertificateData());
            
            boolean isValid = hashMatches && signatureValid;
            
            // Atualizar status da verificação
            signature.setVerifiedAt(LocalDateTime.now());
            signature.setIsValid(isValid);
            signature.setVerificationNotes(isValid ? "Assinatura válida" : "Assinatura inválida");
            digitalSignatureRepository.save(signature);
            
            return isValid;
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao verificar assinatura: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter assinaturas de um documento
     */
    public List<DigitalSignature> getDocumentSignatures(String documentId) {
        return digitalSignatureRepository.findByDocumentId(documentId);
    }
    
    /**
     * Verificar se documento está assinado
     */
    public boolean isDocumentSigned(String documentId) {
        return digitalSignatureRepository.existsByDocumentIdAndIsValidTrue(documentId);
    }
    
    /**
     * Gerar hash do documento
     */
    private String generateDocumentHash(String content) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(content.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar hash: " + e.getMessage(), e);
        }
    }
    
    /**
     * Gerar assinatura digital (simulada)
     */
    private String generateDigitalSignature(String documentHash, String certificateData) {
        try {
            // Em produção, usar biblioteca ICP-Brasil real
            String signature = "DIGITAL_SIGNATURE_" + documentHash + "_" + System.currentTimeMillis();
            return Base64.getEncoder().encodeToString(signature.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar assinatura: " + e.getMessage(), e);
        }
    }
    
    /**
     * Verificar assinatura digital (simulada)
     */
    private boolean verifyDigitalSignature(String signatureData, String documentHash, String certificateData) {
        try {
            // Em produção, usar biblioteca ICP-Brasil real
            String decodedSignature = new String(Base64.getDecoder().decode(signatureData));
            return decodedSignature.contains(documentHash);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Revogar assinatura
     */
    public void revokeSignature(String documentId) {
        List<DigitalSignature> signatures = digitalSignatureRepository.findByDocumentId(documentId);
        for (DigitalSignature signature : signatures) {
            signature.setIsValid(false);
            signature.setVerificationNotes("Assinatura revogada");
            signature.setVerifiedAt(LocalDateTime.now());
        }
        digitalSignatureRepository.saveAll(signatures);
    }
}
