package com.healplus.backend.security.service;

import com.healplus.backend.Model.User;
import com.healplus.backend.security.exception.AccessDeniedException;
import com.healplus.backend.security.exception.InvalidTokenException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * Serviço centralizado para operações de segurança
 */
@Service
public class SecurityService {
    
    /**
     * Obtém o usuário autenticado atual
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Usuário não autenticado");
        }
        
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        
        throw new AccessDeniedException("Tipo de usuário inválido");
    }
    
    /**
     * Verifica se o usuário atual tem uma role específica
     */
    public boolean hasRole(String role) {
        try {
            User user = getCurrentUser();
            return user.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Verifica se o usuário atual tem pelo menos uma das roles especificadas
     */
    public boolean hasAnyRole(String... roles) {
        return Arrays.stream(roles).anyMatch(this::hasRole);
    }
    
    /**
     * Verifica se o usuário atual tem todas as roles especificadas
     */
    public boolean hasAllRoles(String... roles) {
        return Arrays.stream(roles).allMatch(this::hasRole);
    }
    
    /**
     * Verifica se o usuário atual pode acessar um recurso específico
     */
    public boolean canAccessResource(String resource, String action) {
        User user = getCurrentUser();
        
        // Implementar lógica de autorização baseada em recursos
        // Por exemplo, verificar se o usuário pode acessar dados de um paciente específico
        
        return true; // Placeholder
    }
    
    /**
     * Valida se o token JWT é válido e não expirado
     */
    public void validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new InvalidTokenException("Token não fornecido");
        }
        
        // Implementar validação adicional do token
        // Verificar assinatura, expiração, etc.
    }
    
    /**
     * Registra tentativa de acesso negado
     */
    public void logAccessDenied(String resource, String action, String reason) {
        // Implementar logging de segurança
        System.out.println("Access denied: " + resource + " - " + action + " - " + reason);
    }
}
