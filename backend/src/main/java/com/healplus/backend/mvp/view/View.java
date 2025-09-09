package com.healplus.backend.mvp.view;

/**
 * Interface base para Views no padrão MVP
 */
public interface View {
    
    /**
     * Exibe uma mensagem de sucesso
     */
    void showSuccess(String message);
    
    /**
     * Exibe uma mensagem de erro
     */
    void showError(String message);
    
    /**
     * Exibe uma mensagem de informação
     */
    void showInfo(String message);
    
    /**
     * Exibe loading
     */
    void showLoading();
    
    /**
     * Esconde loading
     */
    void hideLoading();
}
