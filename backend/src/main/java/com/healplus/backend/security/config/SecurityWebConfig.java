package com.healplus.backend.security.config;

import com.healplus.backend.security.filter.SecurityAnnotationInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração web para interceptores de segurança
 */
//@Configuration
public class SecurityWebConfig implements WebMvcConfigurer {
    
    @Autowired
    private SecurityAnnotationInterceptor securityAnnotationInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(securityAnnotationInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/auth/**", "/api/public/**");
    }
}
