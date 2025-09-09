package com.healplus.backend.security.exception;

/**
 * Exceção lançada quando o acesso é negado
 */
public class AccessDeniedException extends SecurityException {
    
    public AccessDeniedException(String message) {
        super(message);
    }
    
    public AccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}
