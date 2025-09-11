package com.healplus.backend.Service.Security;

import com.healplus.backend.Model.Entity.DataRetention;
import com.healplus.backend.Repository.Security.DataRetentionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Serviço para gerenciar retenção e descarte automático de dados
 * Conformidade com Lei 13.787 - Prontuário Eletrônico
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DataRetentionService {
    
    private final DataRetentionRepository dataRetentionRepository;
    private final BackupService backupService;
    
    @Value("${app.lgpd.data-retention-days:2555}")
    private int defaultRetentionDays;
    
    /**
     * Registrar dados para retenção
     */
    public DataRetention registerDataRetention(String entityType, String entityId, 
                                             LocalDateTime createdAt, Integer retentionDays) {
        
        DataRetention retention = new DataRetention();
        retention.setEntityType(entityType);
        retention.setEntityId(entityId);
        retention.setCreatedAt(createdAt);
        retention.setRetentionDays(retentionDays != null ? retentionDays : defaultRetentionDays);
        retention.setRetentionUntil(createdAt.plusDays(retention.getRetentionDays()));
        retention.setLegalBasis("LEI_13787");
        retention.setRecordCreatedAt(LocalDateTime.now());
        
        return dataRetentionRepository.save(retention);
    }
    
    /**
     * Executar backup automático (executa diariamente às 2h)
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void executeAutomaticBackup() {
        try {
            List<DataRetention> pendingBackups = dataRetentionRepository
                .findByIsBackedUpFalseAndIsDeletedFalse();
            
            for (DataRetention retention : pendingBackups) {
                try {
                    // Executar backup
                    String backupLocation = backupService.createBackup(
                        retention.getEntityType(), 
                        retention.getEntityId()
                    );
                    
                    // Atualizar registro
                    retention.setIsBackedUp(true);
                    retention.setLastBackupAt(LocalDateTime.now());
                    retention.setBackupLocation(backupLocation);
                    retention.setBackupHash(generateBackupHash(backupLocation));
                    
                    dataRetentionRepository.save(retention);
                    
                } catch (Exception e) {
                    // Log erro mas continua com outros backups
                    System.err.println("Erro no backup de " + retention.getEntityId() + ": " + e.getMessage());
                }
            }
            
        } catch (Exception e) {
            System.err.println("Erro na execução do backup automático: " + e.getMessage());
        }
    }
    
    /**
     * Executar descarte automático (executa diariamente às 3h)
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void executeAutomaticDeletion() {
        try {
            LocalDateTime now = LocalDateTime.now();
            
            // Encontrar registros que expiraram e estão prontos para exclusão
            List<DataRetention> expiredRecords = dataRetentionRepository
                .findByRetentionUntilBeforeAndIsDeletedFalseAndIsMarkedForDeletionFalse(now);
            
            for (DataRetention retention : expiredRecords) {
                try {
                    // Marcar para exclusão (período de graça de 30 dias)
                    retention.setIsMarkedForDeletion(true);
                    retention.setMarkedForDeletionAt(now);
                    retention.setDeletionReason("Prazo de retenção expirado conforme Lei 13.787");
                    retention.setRetentionUntil(now.plusDays(30)); // Período de graça
                    
                    dataRetentionRepository.save(retention);
                    
                } catch (Exception e) {
                    System.err.println("Erro ao marcar para exclusão " + retention.getEntityId() + ": " + e.getMessage());
                }
            }
            
            // Executar exclusão de registros marcados há mais de 30 dias
            LocalDateTime deletionThreshold = now.minusDays(30);
            List<DataRetention> toDelete = dataRetentionRepository
                .findByMarkedForDeletionAtBeforeAndIsDeletedFalse(deletionThreshold);
            
            for (DataRetention retention : toDelete) {
                try {
                    // Verificar se backup existe antes de deletar
                    if (retention.getIsBackedUp()) {
                        // Executar exclusão lógica
                        retention.setIsDeleted(true);
                        retention.setDeletedAt(now);
                        retention.setDeletedBy("SYSTEM_AUTO_DELETION");
                        
                        dataRetentionRepository.save(retention);
                        
                        // Aqui seria feita a exclusão real dos dados da entidade
                        // (implementar conforme necessário)
                        
                    } else {
                        // Se não tem backup, não deletar
                        retention.setDeletionReason("Exclusão cancelada - backup não encontrado");
                        dataRetentionRepository.save(retention);
                    }
                    
                } catch (Exception e) {
                    System.err.println("Erro ao deletar " + retention.getEntityId() + ": " + e.getMessage());
                }
            }
            
        } catch (Exception e) {
            System.err.println("Erro na execução do descarte automático: " + e.getMessage());
        }
    }
    
    /**
     * Verificar integridade dos backups (executa semanalmente)
     */
    @Scheduled(cron = "0 0 4 * * SUN")
    public void verifyBackupIntegrity() {
        try {
            List<DataRetention> backedUpRecords = dataRetentionRepository
                .findByIsBackedUpTrueAndIsDeletedFalse();
            
            for (DataRetention retention : backedUpRecords) {
                try {
                    // Verificar integridade do backup
                    boolean isIntegrityValid = backupService.verifyBackupIntegrity(
                        retention.getBackupLocation(), 
                        retention.getBackupHash()
                    );
                    
                    retention.setIntegrityVerified(isIntegrityValid);
                    retention.setLastVerifiedAt(LocalDateTime.now());
                    retention.setVerificationHash(generateVerificationHash(retention.getBackupLocation()));
                    
                    dataRetentionRepository.save(retention);
                    
                } catch (Exception e) {
                    System.err.println("Erro na verificação de integridade " + retention.getEntityId() + ": " + e.getMessage());
                }
            }
            
        } catch (Exception e) {
            System.err.println("Erro na verificação de integridade: " + e.getMessage());
        }
    }
    
    /**
     * Obter estatísticas de retenção
     */
    public RetentionStatistics getRetentionStatistics() {
        long totalRecords = dataRetentionRepository.count();
        long backedUpRecords = dataRetentionRepository.countByIsBackedUpTrue();
        long pendingDeletion = dataRetentionRepository.countByIsMarkedForDeletionTrueAndIsDeletedFalse();
        long deletedRecords = dataRetentionRepository.countByIsDeletedTrue();
        
        return new RetentionStatistics(totalRecords, backedUpRecords, pendingDeletion, deletedRecords);
    }
    
    /**
     * Gerar hash do backup
     */
    private String generateBackupHash(String backupLocation) {
        // Implementar geração de hash do backup
        return "BACKUP_HASH_" + backupLocation.hashCode() + "_" + System.currentTimeMillis();
    }
    
    /**
     * Gerar hash de verificação
     */
    private String generateVerificationHash(String backupLocation) {
        // Implementar geração de hash de verificação
        return "VERIFICATION_HASH_" + backupLocation.hashCode() + "_" + System.currentTimeMillis();
    }
    
    /**
     * Classe para estatísticas de retenção
     */
    public static class RetentionStatistics {
        private final long totalRecords;
        private final long backedUpRecords;
        private final long pendingDeletion;
        private final long deletedRecords;
        
        public RetentionStatistics(long totalRecords, long backedUpRecords, 
                                 long pendingDeletion, long deletedRecords) {
            this.totalRecords = totalRecords;
            this.backedUpRecords = backedUpRecords;
            this.pendingDeletion = pendingDeletion;
            this.deletedRecords = deletedRecords;
        }
        
        // Getters
        public long getTotalRecords() { return totalRecords; }
        public long getBackedUpRecords() { return backedUpRecords; }
        public long getPendingDeletion() { return pendingDeletion; }
        public long getDeletedRecords() { return deletedRecords; }
    }
}
