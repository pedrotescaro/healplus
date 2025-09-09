package com.healplus.backend.mvp.presenter;

import com.healplus.backend.mvp.view.View;

/**
 * Implementação base para Presenters
 */
public abstract class BasePresenter<V extends View> implements Presenter<V> {
    
    private V view;
    
    @Override
    public void attachView(V view) {
        this.view = view;
    }
    
    @Override
    public void detachView() {
        this.view = null;
    }
    
    @Override
    public boolean isViewAttached() {
        return view != null;
    }
    
    @Override
    public V getView() {
        return view;
    }
    
    /**
     * Executa uma ação se a view estiver anexada
     */
    protected void ifViewAttached(ViewAction<V> action) {
        if (isViewAttached()) {
            action.run(view);
        }
    }
    
    /**
     * Interface funcional para ações na view
     */
    @FunctionalInterface
    protected interface ViewAction<V extends View> {
        void run(V view);
    }
}
