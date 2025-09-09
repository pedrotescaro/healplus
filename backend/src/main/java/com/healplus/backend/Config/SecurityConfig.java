package com.healplus.backend.Config;

import com.healplus.backend.security.config.AdvancedSecurityConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * Configuração de segurança principal - agora usa a configuração avançada
 */
@Configuration
@Import(AdvancedSecurityConfig.class)
public class SecurityConfig {
    // A configuração de segurança foi movida para AdvancedSecurityConfig
    // para melhor organização e funcionalidades avançadas
}
