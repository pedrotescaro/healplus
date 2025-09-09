package com.healplus.backend.security.service;

import com.healplus.backend.Model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Serviço para auditoria de segurança
 */
@Service
public class AuditService {
    
    private final ConcurrentMap<String, List<AuditEvent>> auditLogs = new ConcurrentHashMap<>();
    
    /**
     * Registra um evento de auditoria
     */
    public void logEvent(String userId, String action, String resource, String details) {
        AuditEvent event = new AuditEvent(
            userId,
            action,
            resource,
            details,
            LocalDateTime.now()
        );
        
        auditLogs.computeIfAbsent(userId, k -> new ArrayList<>()).add(event);
    }
    
    /**
     * Registra tentativa de login
     */
    public void logLoginAttempt(String email, boolean success, String details) {
        String action = success ? "LOGIN_SUCCESS" : "LOGIN_FAILED";
        logEvent(email, action, "AUTHENTICATION", details);
    }
    
    /**
     * Registra acesso a recurso
     */
    public void logResourceAccess(User user, String resource, String action) {
        logEvent(user.getId().toString(), action, resource, "Resource access");
    }
    
    /**
     * Registra operação de dados sensíveis
     */
    public void logSensitiveOperation(User user, String operation, String details) {
        logEvent(user.getId().toString(), "SENSITIVE_OPERATION", operation, details);
    }
    
    /**
     * Obtém logs de auditoria para um usuário
     */
    public List<AuditEvent> getAuditLogs(String userId) {
        return auditLogs.getOrDefault(userId, new ArrayList<>());
    }
    
    /**
     * Classe para representar um evento de auditoria
     */
    public static class AuditEvent {
        private final String userId;
        private final String action;
        private final String resource;
        private final String details;
        private final LocalDateTime timestamp;
        
        public AuditEvent(String userId, String action, String resource, String details, LocalDateTime timestamp) {
            this.userId = userId;
            this.action = action;
            this.resource = resource;
            this.details = details;
            this.timestamp = timestamp;
        }
        
        // Getters
        public String getUserId() { return userId; }
        public String getAction() { return action; }
        public String getResource() { return resource; }
        public String getDetails() { return details; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
}
