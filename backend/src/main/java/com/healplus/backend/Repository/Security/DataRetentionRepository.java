package com.healplus.backend.Repository.Security;

import com.healplus.backend.Model.Entity.DataRetention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositório para retenção de dados
 * Conformidade com Lei 13.787 - Prontuário Eletrônico
 */
@Repository
public interface DataRetentionRepository extends JpaRepository<DataRetention, UUID> {
    
    /**
     * Buscar por tipo de entidade
     */
    List<DataRetention> findByEntityType(String entityType);
    
    /**
     * Buscar por ID da entidade
     */
    Optional<DataRetention> findByEntityTypeAndEntityId(String entityType, String entityId);
    
    /**
     * Buscar registros que expiraram
     */
    List<DataRetention> findByRetentionUntilBeforeAndIsDeletedFalse(LocalDateTime date);
    
    /**
     * Buscar registros marcados para exclusão
     */
    List<DataRetention> findByIsMarkedForDeletionTrueAndIsDeletedFalse();
    
    /**
     * Buscar registros que precisam de backup
     */
    List<DataRetention> findByIsBackedUpFalseAndIsDeletedFalse();
    
    /**
     * Buscar registros com backup
     */
    List<DataRetention> findByIsBackedUpTrue();
    
    /**
     * Buscar registros com backup que não foram deletados
     */
    List<DataRetention> findByIsBackedUpTrueAndIsDeletedFalse();
    
    /**
     * Buscar registros deletados
     */
    List<DataRetention> findByIsDeletedTrue();
    
    /**
     * Buscar registros que não foram deletados
     */
    List<DataRetention> findByIsDeletedFalse();
    
    /**
     * Buscar registros que requerem tratamento especial
     */
    List<DataRetention> findByRequiresSpecialHandlingTrue();
    
    /**
     * Buscar registros com integridade verificada
     */
    List<DataRetention> findByIntegrityVerifiedTrue();
    
    /**
     * Buscar registros com integridade falhada
     */
    List<DataRetention> findByIntegrityVerifiedFalse();
    
    /**
     * Buscar registros por base legal
     */
    List<DataRetention> findByLegalBasis(String legalBasis);
    
    /**
     * Buscar registros que expiraram e estão prontos para exclusão
     */
    @Query("SELECT dr FROM DataRetention dr WHERE dr.retentionUntil < :currentDate " +
           "AND dr.isDeleted = false AND dr.isMarkedForDeletion = false")
    List<DataRetention> findExpiredRecordsReadyForDeletion(@Param("currentDate") LocalDateTime currentDate);
    
    /**
     * Buscar registros que expiraram e estão prontos para exclusão (método alternativo)
     */
    List<DataRetention> findByRetentionUntilBeforeAndIsDeletedFalseAndIsMarkedForDeletionFalse(LocalDateTime date);
    
    /**
     * Buscar registros marcados para exclusão há mais de X dias
     */
    @Query("SELECT dr FROM DataRetention dr WHERE dr.markedForDeletionAt < :thresholdDate " +
           "AND dr.isDeleted = false")
    List<DataRetention> findRecordsMarkedForDeletionBefore(@Param("thresholdDate") LocalDateTime thresholdDate);
    
    /**
     * Buscar registros marcados para exclusão há mais de X dias (método alternativo)
     */
    List<DataRetention> findByMarkedForDeletionAtBeforeAndIsDeletedFalse(LocalDateTime thresholdDate);
    
    /**
     * Contar registros por status de backup
     */
    long countByIsBackedUpTrue();
    
    /**
     * Contar registros por status de exclusão
     */
    long countByIsMarkedForDeletionTrueAndIsDeletedFalse();
    
    /**
     * Contar registros deletados
     */
    long countByIsDeletedTrue();
    
    /**
     * Contar registros com integridade verificada
     */
    long countByIntegrityVerifiedTrue();
    
    /**
     * Contar registros com integridade falhada
     */
    long countByIntegrityVerifiedFalse();
    
    /**
     * Contar registros que requerem tratamento especial
     */
    long countByRequiresSpecialHandlingTrue();
    
    /**
     * Buscar registros por período de criação
     */
    @Query("SELECT dr FROM DataRetention dr WHERE dr.createdAt BETWEEN :startDate AND :endDate")
    List<DataRetention> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
    
    /**
     * Buscar registros que precisam de verificação de integridade
     */
    @Query("SELECT dr FROM DataRetention dr WHERE dr.lastVerifiedAt IS NULL " +
           "OR dr.lastVerifiedAt < :thresholdDate")
    List<DataRetention> findRecordsNeedingIntegrityVerification(@Param("thresholdDate") LocalDateTime thresholdDate);
    
    /**
     * Buscar estatísticas por tipo de entidade
     */
    @Query("SELECT dr.entityType, COUNT(dr) FROM DataRetention dr GROUP BY dr.entityType")
    List<Object[]> getStatisticsByEntityType();
    
    /**
     * Buscar estatísticas por base legal
     */
    @Query("SELECT dr.legalBasis, COUNT(dr) FROM DataRetention dr GROUP BY dr.legalBasis")
    List<Object[]> getStatisticsByLegalBasis();
}
