package com.healplus.backend.security.exception;

/**
 * Exceção lançada quando um token JWT é inválido
 */
public class InvalidTokenException extends SecurityException {
    
    public InvalidTokenException(String message) {
        super(message);
    }
    
    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
