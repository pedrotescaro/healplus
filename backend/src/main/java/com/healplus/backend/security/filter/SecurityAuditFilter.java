package com.healplus.backend.security.filter;

import com.healplus.backend.security.service.AuditService;
import com.healplus.backend.security.service.SecurityService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro para auditoria de requisições
 */
@Component
public class SecurityAuditFilter extends OncePerRequestFilter {
    
    @Autowired
    private AuditService auditService;
    
    @Autowired
    private SecurityService securityService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        long startTime = System.currentTimeMillis();
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            
            // Registrar auditoria para requisições sensíveis
            if (isSensitiveRequest(request)) {
                try {
                    String userId = getCurrentUserId();
                    String action = request.getMethod() + " " + request.getRequestURI();
                    auditService.logEvent(userId, "HTTP_REQUEST", request.getRequestURI(), 
                        "Duration: " + duration + "ms, Status: " + response.getStatus());
                } catch (Exception e) {
                    // Log error but don't break the request
                    logger.warn("Failed to audit request", e);
                }
            }
        }
    }
    
    private boolean isSensitiveRequest(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.contains("/api/patients") || 
               uri.contains("/api/assessments") || 
               uri.contains("/api/appointments") ||
               uri.contains("/api/telehealth");
    }
    
    private String getCurrentUserId() {
        try {
            return securityService.getCurrentUser().getId().toString();
        } catch (Exception e) {
            return "anonymous";
        }
    }
}
