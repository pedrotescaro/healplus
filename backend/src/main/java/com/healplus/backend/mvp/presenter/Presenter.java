package com.healplus.backend.mvp.presenter;

import com.healplus.backend.mvp.view.View;

/**
 * Interface base para Presenters no padrão MVP
 */
public interface Presenter<V extends View> {
    
    /**
     * Anexa a view ao presenter
     */
    void attachView(V view);
    
    /**
     * Desanexa a view do presenter
     */
    void detachView();
    
    /**
     * Verifica se a view está anexada
     */
    boolean isViewAttached();
    
    /**
     * Obtém a view anexada
     */
    V getView();
}
