package com.healplus.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Serviço para gerenciar backup automático de dados médicos
 * Conformidade com Lei 13.787 - Prontuário Eletrônico
 */
@Service
@RequiredArgsConstructor
@Transactional
public class BackupService {
    
    @Value("${app.backup.directory:/backups}")
    private String backupDirectory;
    
    @Value("${app.backup.encryption.enabled:true}")
    private boolean encryptionEnabled;
    
    @Value("${app.backup.encryption.key:default-backup-key}")
    private String encryptionKey;
    
    /**
     * Criar backup de uma entidade
     */
    public String createBackup(String entityType, String entityId) {
        try {
            // Criar diretório de backup se não existir
            Path backupPath = Paths.get(backupDirectory);
            if (!Files.exists(backupPath)) {
                Files.createDirectories(backupPath);
            }
            
            // Gerar nome do arquivo de backup
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String backupFileName = String.format("%s_%s_%s.zip", entityType, entityId, timestamp);
            Path backupFilePath = backupPath.resolve(backupFileName);
            
            // Criar arquivo de backup
            try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(backupFilePath.toFile()))) {
                // Adicionar metadados do backup
                addBackupMetadata(zipOut, entityType, entityId, timestamp);
                
                // Adicionar dados da entidade (simulado)
                addEntityData(zipOut, entityType, entityId);
                
                // Adicionar logs de auditoria relacionados
                addAuditLogs(zipOut, entityType, entityId);
            }
            
            // Criptografar backup se habilitado
            if (encryptionEnabled) {
                encryptBackup(backupFilePath);
            }
            
            // Gerar hash do backup
            String backupHash = generateFileHash(backupFilePath);
            
            // Salvar hash em arquivo separado
            Path hashFilePath = backupPath.resolve(backupFileName + ".hash");
            Files.write(hashFilePath, backupHash.getBytes());
            
            return backupFilePath.toString();
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar backup: " + e.getMessage(), e);
        }
    }
    
    /**
     * Verificar integridade do backup
     */
    public boolean verifyBackupIntegrity(String backupLocation, String expectedHash) {
        try {
            Path backupPath = Paths.get(backupLocation);
            if (!Files.exists(backupPath)) {
                return false;
            }
            
            // Gerar hash atual do arquivo
            String currentHash = generateFileHash(backupPath);
            
            // Comparar com hash esperado
            return currentHash.equals(expectedHash);
            
        } catch (Exception e) {
            System.err.println("Erro ao verificar integridade do backup: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Restaurar backup
     */
    public boolean restoreBackup(String backupLocation) {
        try {
            Path backupPath = Paths.get(backupLocation);
            if (!Files.exists(backupPath)) {
                return false;
            }
            
            // Descriptografar se necessário
            if (encryptionEnabled) {
                decryptBackup(backupPath);
            }
            
            // Extrair e restaurar dados
            try (FileInputStream fis = new FileInputStream(backupPath.toFile());
                 java.util.zip.ZipInputStream zis = new java.util.zip.ZipInputStream(fis)) {
                
                java.util.zip.ZipEntry entry;
                while ((entry = zis.getNextEntry()) != null) {
                    // Processar cada arquivo do backup
                    processBackupEntry(entry, zis);
                }
            }
            
            return true;
            
        } catch (Exception e) {
            System.err.println("Erro ao restaurar backup: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Listar backups disponíveis
     */
    public java.util.List<BackupInfo> listBackups() {
        try {
            Path backupPath = Paths.get(backupDirectory);
            if (!Files.exists(backupPath)) {
                return java.util.Collections.emptyList();
            }
            
            return Files.list(backupPath)
                .filter(path -> path.toString().endsWith(".zip"))
                .map(this::createBackupInfo)
                .collect(java.util.stream.Collectors.toList());
            
        } catch (Exception e) {
            System.err.println("Erro ao listar backups: " + e.getMessage());
            return java.util.Collections.emptyList();
        }
    }
    
    /**
     * Adicionar metadados do backup
     */
    private void addBackupMetadata(ZipOutputStream zipOut, String entityType, String entityId, String timestamp) throws IOException {
        ZipEntry metadataEntry = new ZipEntry("backup_metadata.json");
        zipOut.putNextEntry(metadataEntry);
        
        String metadata = String.format("""
            {
                "entityType": "%s",
                "entityId": "%s",
                "backupTimestamp": "%s",
                "backupVersion": "1.0",
                "encryptionEnabled": %s,
                "createdBy": "SYSTEM_AUTO_BACKUP"
            }
            """, entityType, entityId, timestamp, encryptionEnabled);
        
        zipOut.write(metadata.getBytes());
        zipOut.closeEntry();
    }
    
    /**
     * Adicionar dados da entidade
     */
    private void addEntityData(ZipOutputStream zipOut, String entityType, String entityId) throws IOException {
        ZipEntry dataEntry = new ZipEntry("entity_data.json");
        zipOut.putNextEntry(dataEntry);
        
        // Simular dados da entidade (em produção, buscar do banco)
        String entityData = String.format("""
            {
                "entityType": "%s",
                "entityId": "%s",
                "data": "Dados da entidade %s com ID %s",
                "backupTimestamp": "%s"
            }
            """, entityType, entityId, entityType, entityId, LocalDateTime.now());
        
        zipOut.write(entityData.getBytes());
        zipOut.closeEntry();
    }
    
    /**
     * Adicionar logs de auditoria
     */
    private void addAuditLogs(ZipOutputStream zipOut, String entityType, String entityId) throws IOException {
        ZipEntry auditEntry = new ZipEntry("audit_logs.json");
        zipOut.putNextEntry(auditEntry);
        
        // Simular logs de auditoria (em produção, buscar do banco)
        String auditLogs = String.format("""
            {
                "entityType": "%s",
                "entityId": "%s",
                "auditLogs": [
                    {
                        "timestamp": "%s",
                        "action": "CREATE",
                        "userId": "system",
                        "details": "Entidade criada"
                    },
                    {
                        "timestamp": "%s",
                        "action": "BACKUP",
                        "userId": "system",
                        "details": "Backup automático criado"
                    }
                ]
            }
            """, entityType, entityId, LocalDateTime.now().minusDays(1), LocalDateTime.now());
        
        zipOut.write(auditLogs.getBytes());
        zipOut.closeEntry();
    }
    
    /**
     * Criptografar backup
     */
    private void encryptBackup(Path backupPath) throws Exception {
        // Implementação simplificada de criptografia
        // Em produção, usar biblioteca de criptografia robusta
        byte[] data = Files.readAllBytes(backupPath);
        byte[] encrypted = Base64.getEncoder().encode(data);
        Files.write(backupPath, encrypted);
    }
    
    /**
     * Descriptografar backup
     */
    private void decryptBackup(Path backupPath) throws Exception {
        // Implementação simplificada de descriptografia
        byte[] encrypted = Files.readAllBytes(backupPath);
        byte[] decrypted = Base64.getDecoder().decode(encrypted);
        Files.write(backupPath, decrypted);
    }
    
    /**
     * Gerar hash do arquivo
     */
    private String generateFileHash(Path filePath) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] fileBytes = Files.readAllBytes(filePath);
        byte[] hash = digest.digest(fileBytes);
        return Base64.getEncoder().encodeToString(hash);
    }
    
    /**
     * Criar informações do backup
     */
    private BackupInfo createBackupInfo(Path backupPath) {
        try {
            long size = Files.size(backupPath);
            LocalDateTime lastModified = LocalDateTime.ofInstant(
                Files.getLastModifiedTime(backupPath).toInstant(),
                java.time.ZoneId.systemDefault()
            );
            
            return new BackupInfo(
                backupPath.getFileName().toString(),
                backupPath.toString(),
                size,
                lastModified
            );
            
        } catch (Exception e) {
            return new BackupInfo(
                backupPath.getFileName().toString(),
                backupPath.toString(),
                0,
                LocalDateTime.now()
            );
        }
    }
    
    /**
     * Processar entrada do backup
     */
    private void processBackupEntry(java.util.zip.ZipEntry entry, java.util.zip.ZipInputStream zis) throws IOException {
        // Implementar processamento de cada arquivo do backup
        // Em produção, restaurar dados no banco de dados
        byte[] buffer = new byte[1024];
        int len;
        while ((len = zis.read(buffer)) > 0) {
            // Processar dados
        }
        zis.closeEntry();
    }
    
    /**
     * Classe para informações do backup
     */
    public static class BackupInfo {
        private final String fileName;
        private final String filePath;
        private final long size;
        private final LocalDateTime lastModified;
        
        public BackupInfo(String fileName, String filePath, long size, LocalDateTime lastModified) {
            this.fileName = fileName;
            this.filePath = filePath;
            this.size = size;
            this.lastModified = lastModified;
        }
        
        // Getters
        public String getFileName() { return fileName; }
        public String getFilePath() { return filePath; }
        public long getSize() { return size; }
        public LocalDateTime getLastModified() { return lastModified; }
    }
}
