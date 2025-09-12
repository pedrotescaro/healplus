package com.healplus.backend.Repository.Security;

import com.healplus.backend.Model.Entity.DigitalSignature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositório para assinaturas digitais
 */
@Repository
public interface DigitalSignatureRepository extends JpaRepository<DigitalSignature, UUID> {
    
    /**
     * Buscar assinaturas por documento
     */
    List<DigitalSignature> findByDocumentId(String documentId);
    
    /**
     * Buscar assinatura por documento e tipo
     */
    Optional<DigitalSignature> findByDocumentIdAndDocumentType(String documentId, String documentType);
    
    /**
     * Verificar se documento está assinado
     */
    boolean existsByDocumentIdAndIsValidTrue(String documentId);
    
    /**
     * Buscar assinaturas por assinante
     */
    List<DigitalSignature> findBySignerId(String signerId);
    
    /**
     * Buscar assinaturas por período
     */
    @Query("SELECT ds FROM DigitalSignature ds WHERE ds.signedAt BETWEEN :startDate AND :endDate")
    List<DigitalSignature> findBySignedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    /**
     * Buscar assinaturas válidas
     */
    List<DigitalSignature> findByIsValidTrue();
    
    /**
     * Buscar assinaturas expiradas
     */
    @Query("SELECT ds FROM DigitalSignature ds WHERE ds.certificateValidTo < :currentDate")
    List<DigitalSignature> findExpiredSignatures(@Param("currentDate") LocalDateTime currentDate);
    
    /**
     * Buscar assinaturas por tipo de documento
     */
    List<DigitalSignature> findByDocumentType(String documentType);
    
    /**
     * Contar assinaturas por assinante
     */
    long countBySignerId(String signerId);
    
    /**
     * Buscar assinaturas que precisam de verificação
     */
    @Query("SELECT ds FROM DigitalSignature ds WHERE ds.verifiedAt IS NULL OR ds.verifiedAt < :thresholdDate")
    List<DigitalSignature> findSignaturesNeedingVerification(@Param("thresholdDate") LocalDateTime thresholdDate);
}
