package com.healplus.backend.Service;

import com.healplus.backend.Model.DataRetention;
import com.healplus.backend.Repository.Security.DataRetentionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Serviço para verificação contínua de integridade de dados médicos
 * Conformidade com Lei 13.787 - Prontuário Eletrônico
 */
@Service
@RequiredArgsConstructor
@Transactional
public class IntegrityVerificationService {
    
    private final DataRetentionRepository dataRetentionRepository;
    private final BackupService backupService;
    private final ExecutorService executorService = Executors.newFixedThreadPool(5);
    
    /**
     * Verificação de integridade contínua (executa a cada 6 horas)
     */
    @Scheduled(fixedRate = 21600000) // 6 horas
    public void performIntegrityVerification() {
        try {
            List<DataRetention> recordsToVerify = dataRetentionRepository
                .findByIsDeletedFalse();
            
            List<CompletableFuture<Void>> verificationTasks = new ArrayList<>();
            
            for (DataRetention record : recordsToVerify) {
                CompletableFuture<Void> task = CompletableFuture.runAsync(() -> {
                    try {
                        verifyRecordIntegrity(record);
                    } catch (Exception e) {
                        System.err.println("Erro na verificação de integridade para " + 
                                         record.getEntityId() + ": " + e.getMessage());
                    }
                }, executorService);
                
                verificationTasks.add(task);
            }
            
            // Aguardar todas as verificações
            CompletableFuture.allOf(verificationTasks.toArray(new CompletableFuture[0])).join();
            
        } catch (Exception e) {
            System.err.println("Erro na verificação de integridade contínua: " + e.getMessage());
        }
    }
    
    /**
     * Verificar integridade de um registro específico
     */
    public boolean verifyRecordIntegrity(DataRetention record) {
        try {
            boolean isIntegrityValid = true;
            List<String> issues = new ArrayList<>();
            
            // 1. Verificar integridade dos dados originais
            if (!verifyDataIntegrity(record)) {
                isIntegrityValid = false;
                issues.add("Dados originais corrompidos");
            }
            
            // 2. Verificar integridade do backup (se existir)
            if (record.getIsBackedUp() && record.getBackupLocation() != null) {
                if (!backupService.verifyBackupIntegrity(record.getBackupLocation(), record.getBackupHash())) {
                    isIntegrityValid = false;
                    issues.add("Backup corrompido");
                }
            }
            
            // 3. Verificar hash de verificação
            if (record.getVerificationHash() != null) {
                String currentHash = generateVerificationHash(record);
                if (!currentHash.equals(record.getVerificationHash())) {
                    isIntegrityValid = false;
                    issues.add("Hash de verificação não confere");
                }
            }
            
            // 4. Verificar timestamps
            if (record.getCreatedAt().isAfter(LocalDateTime.now())) {
                isIntegrityValid = false;
                issues.add("Timestamp de criação inválido");
            }
            
            if (record.getRetentionUntil().isBefore(record.getCreatedAt())) {
                isIntegrityValid = false;
                issues.add("Data de retenção inválida");
            }
            
            // Atualizar registro com resultado da verificação
            record.setIntegrityVerified(isIntegrityValid);
            record.setLastVerifiedAt(LocalDateTime.now());
            record.setVerificationHash(generateVerificationHash(record));
            
            if (!isIntegrityValid) {
                record.setSpecialHandlingNotes("Problemas de integridade detectados: " + String.join(", ", issues));
                record.setRequiresSpecialHandling(true);
            }
            
            dataRetentionRepository.save(record);
            
            return isIntegrityValid;
            
        } catch (Exception e) {
            System.err.println("Erro na verificação de integridade do registro " + 
                             record.getEntityId() + ": " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Verificar integridade dos dados originais
     */
    private boolean verifyDataIntegrity(DataRetention record) {
        try {
            // Simular verificação de integridade dos dados
            // Em produção, verificar dados reais no banco
            
            // Verificar se a entidade ainda existe
            boolean entityExists = checkEntityExists(record.getEntityType(), record.getEntityId());
            if (!entityExists) {
                return false;
            }
            
            // Verificar consistência dos dados
            boolean dataConsistent = checkDataConsistency(record);
            if (!dataConsistent) {
                return false;
            }
            
            // Verificar permissões de acesso
            boolean accessValid = checkAccessPermissions(record);
            if (!accessValid) {
                return false;
            }
            
            return true;
            
        } catch (Exception e) {
            System.err.println("Erro na verificação de integridade dos dados: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Verificar se a entidade ainda existe
     */
    private boolean checkEntityExists(String entityType, String entityId) {
        try {
            // Simular verificação de existência
            // Em produção, fazer consulta real no banco
            return true; // Simulado
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Verificar consistência dos dados
     */
    private boolean checkDataConsistency(DataRetention record) {
        try {
            // Verificar se os campos obrigatórios estão preenchidos
            if (record.getEntityType() == null || record.getEntityType().trim().isEmpty()) {
                return false;
            }
            
            if (record.getEntityId() == null || record.getEntityId().trim().isEmpty()) {
                return false;
            }
            
            if (record.getCreatedAt() == null) {
                return false;
            }
            
            if (record.getRetentionUntil() == null) {
                return false;
            }
            
            // Verificar se a data de retenção é válida
            if (record.getRetentionUntil().isBefore(record.getCreatedAt())) {
                return false;
            }
            
            return true;
            
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Verificar permissões de acesso
     */
    private boolean checkAccessPermissions(DataRetention record) {
        try {
            // Simular verificação de permissões
            // Em produção, verificar permissões reais
            return true; // Simulado
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Gerar hash de verificação
     */
    private String generateVerificationHash(DataRetention record) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            
            String dataToHash = String.format("%s_%s_%s_%s_%s",
                record.getEntityType(),
                record.getEntityId(),
                record.getCreatedAt().toString(),
                record.getRetentionUntil().toString(),
                record.getLegalBasis()
            );
            
            byte[] hash = digest.digest(dataToHash.getBytes("UTF-8"));
            return bytesToHex(hash);
            
        } catch (Exception e) {
            return "ERROR_HASH_" + System.currentTimeMillis();
        }
    }
    
    /**
     * Converter bytes para hexadecimal
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
    
    /**
     * Obter estatísticas de integridade
     */
    public IntegrityStatistics getIntegrityStatistics() {
        try {
            long totalRecords = dataRetentionRepository.count();
            long verifiedRecords = dataRetentionRepository.countByIntegrityVerifiedTrue();
            long failedRecords = dataRetentionRepository.countByIntegrityVerifiedFalse();
            long specialHandlingRecords = dataRetentionRepository.countByRequiresSpecialHandlingTrue();
            
            return new IntegrityStatistics(totalRecords, verifiedRecords, failedRecords, specialHandlingRecords);
            
        } catch (Exception e) {
            System.err.println("Erro ao obter estatísticas de integridade: " + e.getMessage());
            return new IntegrityStatistics(0, 0, 0, 0);
        }
    }
    
    /**
     * Forçar verificação de integridade para um registro específico
     */
    public boolean forceIntegrityVerification(String entityType, String entityId) {
        try {
            DataRetention record = dataRetentionRepository
                .findByEntityTypeAndEntityId(entityType, entityId)
                .orElse(null);
            
            if (record == null) {
                return false;
            }
            
            return verifyRecordIntegrity(record);
            
        } catch (Exception e) {
            System.err.println("Erro na verificação forçada de integridade: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Classe para estatísticas de integridade
     */
    public static class IntegrityStatistics {
        private final long totalRecords;
        private final long verifiedRecords;
        private final long failedRecords;
        private final long specialHandlingRecords;
        
        public IntegrityStatistics(long totalRecords, long verifiedRecords, 
                                 long failedRecords, long specialHandlingRecords) {
            this.totalRecords = totalRecords;
            this.verifiedRecords = verifiedRecords;
            this.failedRecords = failedRecords;
            this.specialHandlingRecords = specialHandlingRecords;
        }
        
        // Getters
        public long getTotalRecords() { return totalRecords; }
        public long getVerifiedRecords() { return verifiedRecords; }
        public long getFailedRecords() { return failedRecords; }
        public long getSpecialHandlingRecords() { return specialHandlingRecords; }
        
        public double getIntegrityPercentage() {
            if (totalRecords == 0) return 0.0;
            return (double) verifiedRecords / totalRecords * 100.0;
        }
    }
}
