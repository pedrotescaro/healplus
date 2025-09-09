package com.healplus.backend.mvp.view;

import com.healplus.backend.Model.WoundAssessment;
import java.util.List;
import java.util.UUID;

/**
 * Interface para a view de avaliações de feridas
 */
public interface WoundAssessmentView extends View {
    
    /**
     * Exibe a lista de avaliações
     */
    void showAssessments(List<WoundAssessment> assessments);
    
    /**
     * Exibe os detalhes de uma avaliação
     */
    void showAssessmentDetails(WoundAssessment assessment);
    
    /**
     * Exibe formulário para criar/editar avaliação
     */
    void showAssessmentForm(WoundAssessment assessment);
    
    /**
     * Remove uma avaliação da lista
     */
    void removeAssessment(UUID assessmentId);
    
    /**
     * Adiciona uma nova avaliação à lista
     */
    void addAssessment(WoundAssessment assessment);
    
    /**
     * Atualiza uma avaliação na lista
     */
    void updateAssessment(WoundAssessment assessment);
    
    /**
     * Navega para a tela de detalhes da avaliação
     */
    void navigateToAssessmentDetails(UUID assessmentId);
    
    /**
     * Navega para a tela de edição da avaliação
     */
    void navigateToEditAssessment(UUID assessmentId);
    
    /**
     * Exibe análise de IA
     */
    void showAIAnalysis(String analysis);
}
