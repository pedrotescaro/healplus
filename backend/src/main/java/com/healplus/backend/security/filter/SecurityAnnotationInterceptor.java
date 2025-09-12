package com.healplus.backend.security.filter;

import com.healplus.backend.security.annotation.RequireRole;
import com.healplus.backend.security.annotation.RateLimited;
import com.healplus.backend.security.service.RateLimitService;
import com.healplus.backend.security.service.SecurityService;
import com.healplus.backend.security.exception.AccessDeniedException;
import com.healplus.backend.security.exception.SecurityException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Method;

/**
 * Interceptor para processar anotações de segurança
 */
@Component
public class SecurityAnnotationInterceptor implements HandlerInterceptor {
    
    @Autowired
    private SecurityService securityService;
    
    @Autowired
    private RateLimitService rateLimitService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();
        
        // Verificar anotação @RequireRole
        RequireRole requireRole = method.getAnnotation(RequireRole.class);
        if (requireRole != null) {
            checkRoleAuthorization(requireRole);
        }
        
        // Verificar anotação @RateLimited
        RateLimited rateLimited = method.getAnnotation(RateLimited.class);
        if (rateLimited != null) {
            checkRateLimit(request, rateLimited);
        }
        
        return true;
    }
    
    private void checkRoleAuthorization(RequireRole requireRole) {
        String[] requiredRoles = requireRole.value();
        if (requiredRoles.length == 0) {
            return;
        }
        
        boolean hasAccess;
        if (requireRole.requireAll()) {
            hasAccess = securityService.hasAllRoles(requiredRoles);
        } else {
            hasAccess = securityService.hasAnyRole(requiredRoles);
        }
        
        if (!hasAccess) {
            throw new AccessDeniedException("Usuário não possui as roles necessárias: " + String.join(", ", requiredRoles));
        }
    }
    
    private void checkRateLimit(HttpServletRequest request, RateLimited rateLimited) {
        String clientIp = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        String key = clientIp + ":" + userAgent;
        
        if (!rateLimitService.isAllowed(key, rateLimited)) {
            throw new SecurityException("Rate limit exceeded. Maximum " + rateLimited.requests() + 
                " requests per " + rateLimited.windowMinutes() + " minutes.");
        }
        
        rateLimitService.recordRequest(key, rateLimited);
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
