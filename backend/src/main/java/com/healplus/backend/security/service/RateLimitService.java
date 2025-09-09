package com.healplus.backend.security.service;

import com.healplus.backend.security.annotation.RateLimited;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Serviço para controle de rate limiting
 */
@Service
public class RateLimitService {
    
    private final ConcurrentMap<String, RateLimitInfo> rateLimitCache = new ConcurrentHashMap<>();
    
    /**
     * Verifica se a requisição está dentro do limite de rate
     */
    public boolean isAllowed(String key, RateLimited rateLimited) {
        String cacheKey = generateCacheKey(key, rateLimited);
        RateLimitInfo info = rateLimitCache.computeIfAbsent(cacheKey, 
            k -> new RateLimitInfo(rateLimited.requests(), rateLimited.windowMinutes()));
        
        return info.isAllowed();
    }
    
    /**
     * Registra uma requisição
     */
    public void recordRequest(String key, RateLimited rateLimited) {
        String cacheKey = generateCacheKey(key, rateLimited);
        RateLimitInfo info = rateLimitCache.computeIfAbsent(cacheKey, 
            k -> new RateLimitInfo(rateLimited.requests(), rateLimited.windowMinutes()));
        
        info.recordRequest();
    }
    
    private String generateCacheKey(String key, RateLimited rateLimited) {
        if (key.isEmpty()) {
            return "default_" + rateLimited.requests() + "_" + rateLimited.windowMinutes();
        }
        return key + "_" + rateLimited.requests() + "_" + rateLimited.windowMinutes();
    }
    
    /**
     * Classe interna para armazenar informações de rate limiting
     */
    private static class RateLimitInfo {
        private final int maxRequests;
        private final int windowMinutes;
        private int currentRequests;
        private LocalDateTime windowStart;
        
        public RateLimitInfo(int maxRequests, int windowMinutes) {
            this.maxRequests = maxRequests;
            this.windowMinutes = windowMinutes;
            this.currentRequests = 0;
            this.windowStart = LocalDateTime.now();
        }
        
        public boolean isAllowed() {
            resetWindowIfNeeded();
            return currentRequests < maxRequests;
        }
        
        public void recordRequest() {
            resetWindowIfNeeded();
            currentRequests++;
        }
        
        private void resetWindowIfNeeded() {
            LocalDateTime now = LocalDateTime.now();
            if (windowStart.plusMinutes(windowMinutes).isBefore(now)) {
                currentRequests = 0;
                windowStart = now;
            }
        }
    }
}
