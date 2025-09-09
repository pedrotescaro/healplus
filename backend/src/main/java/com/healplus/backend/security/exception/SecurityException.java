package com.healplus.backend.security.exception;

/**
 * Exceção base para problemas de segurança
 */
public class SecurityException extends RuntimeException {
    
    public SecurityException(String message) {
        super(message);
    }
    
    public SecurityException(String message, Throwable cause) {
        super(message, cause);
    }
}
