package com.healplus.backend.Service.AI;

import com.healplus.backend.Model.*;
import com.healplus.backend.Repository.AIAnalysisRepository;
import com.healplus.backend.Repository.WoundImageRepository;
import com.healplus.backend.Repository.WoundAssessmentRepository;
import com.healplus.backend.Service.Wound.ImageProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class AIService {
    
    @Autowired
    private AIAnalysisRepository aiAnalysisRepository;
    
    @Autowired
    private WoundImageRepository woundImageRepository;
    
    @Autowired
    private WoundAssessmentRepository woundAssessmentRepository;
    
    @Autowired
    private ImageProcessingService imageProcessingService;
    
    @Autowired
    private MachineLearningService machineLearningService;
    
    /**
     * Análise completa de ferida usando IA
     */
    public CompletableFuture<AIAnalysis> analyzeWoundComprehensive(WoundAssessment assessment, MultipartFile imageFile) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // 1. Processar e salvar a imagem
                WoundImage woundImage = imageProcessingService.processAndSaveImage(assessment, imageFile);
                
                // 2. Executar análise de segmentação
                AIAnalysis segmentationAnalysis = performWoundSegmentation(woundImage);
                
                // 3. Executar classificação de tecidos
                AIAnalysis tissueAnalysis = performTissueClassification(woundImage);
                
                // 4. Executar análise de infecção
                AIAnalysis infectionAnalysis = performInfectionAnalysis(woundImage, assessment);
                
                // 5. Executar análise de umidade
                AIAnalysis moistureAnalysis = performMoistureAnalysis(woundImage, assessment);
                
                // 6. Executar análise de bordas
                AIAnalysis edgeAnalysis = performEdgeAnalysis(woundImage, assessment);
                
                // 7. Executar predição de cicatrização
                AIAnalysis healingAnalysis = performHealingPrediction(assessment, Arrays.asList(
                    segmentationAnalysis, tissueAnalysis, infectionAnalysis, 
                    moistureAnalysis, edgeAnalysis));
                
                // 8. Gerar recomendações de tratamento
                AIAnalysis treatmentAnalysis = generateTreatmentRecommendations(assessment, Arrays.asList(
                    segmentationAnalysis, tissueAnalysis, infectionAnalysis, 
                    moistureAnalysis, edgeAnalysis, healingAnalysis));
                
                // 9. Criar análise abrangente
                AIAnalysis comprehensiveAnalysis = createComprehensiveAnalysis(
                    assessment, woundImage, Arrays.asList(
                        segmentationAnalysis, tissueAnalysis, infectionAnalysis, 
                        moistureAnalysis, edgeAnalysis, healingAnalysis, treatmentAnalysis));
                
                return comprehensiveAnalysis;
                
            } catch (Exception e) {
                throw new RuntimeException("Erro na análise de IA: " + e.getMessage(), e);
            }
        });
    }
    
    /**
     * Segmentação da ferida
     */
    public AIAnalysis performWoundSegmentation(WoundImage woundImage) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Simular processamento de segmentação (em produção, usar modelo real)
            Map<String, Object> segmentationResults = machineLearningService.performSegmentation(
                woundImage.getOriginalImagePath());
            
            AIAnalysis analysis = new AIAnalysis();
            analysis.setWoundImage(woundImage);
            analysis.setAnalysisType(AIAnalysis.AnalysisType.WOUND_SEGMENTATION);
            analysis.setModelType(AIAnalysis.ModelType.U_NET);
            analysis.setModelVersion("1.0.0");
            analysis.setAnalysisDate(LocalDateTime.now());
            
            // Extrair resultados da segmentação
            analysis.setWoundArea((Double) segmentationResults.get("woundArea"));
            analysis.setWoundPerimeter((Double) segmentationResults.get("woundPerimeter"));
            analysis.setWoundDepth((Double) segmentationResults.get("woundDepth"));
            analysis.setWoundShape((String) segmentationResults.get("woundShape"));
            analysis.setSegmentationMaskPath((String) segmentationResults.get("maskPath"));
            
            analysis.setProcessingTimeMs((double) (System.currentTimeMillis() - startTime));
            analysis.setOverallConfidence((Double) segmentationResults.get("confidence"));
            analysis.setRawResults(segmentationResults.toString());
            
            return aiAnalysisRepository.save(analysis);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro na segmentação: " + e.getMessage(), e);
        }
    }
    
    /**
     * Classificação de tecidos
     */
    public AIAnalysis performTissueClassification(WoundImage woundImage) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Simular classificação de tecidos (em produção, usar modelo real)
            Map<String, Object> tissueResults = machineLearningService.performTissueClassification(
                woundImage.getOriginalImagePath());
            
            AIAnalysis analysis = new AIAnalysis();
            analysis.setWoundImage(woundImage);
            analysis.setAnalysisType(AIAnalysis.AnalysisType.TISSUE_CLASSIFICATION);
            analysis.setModelType(AIAnalysis.ModelType.RESNET);
            analysis.setModelVersion("1.0.0");
            analysis.setAnalysisDate(LocalDateTime.now());
            
            // Extrair resultados da classificação
            analysis.setGranulationPercentage((Double) tissueResults.get("granulationPercentage"));
            analysis.setSloughPercentage((Double) tissueResults.get("sloughPercentage"));
            analysis.setNecrosisPercentage((Double) tissueResults.get("necrosisPercentage"));
            analysis.setEpithelialPercentage((Double) tissueResults.get("epithelialPercentage"));
            analysis.setHealthySkinPercentage((Double) tissueResults.get("healthySkinPercentage"));
            
            analysis.setProcessingTimeMs((double) (System.currentTimeMillis() - startTime));
            analysis.setOverallConfidence((Double) tissueResults.get("confidence"));
            analysis.setRawResults(tissueResults.toString());
            
            return aiAnalysisRepository.save(analysis);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro na classificação de tecidos: " + e.getMessage(), e);
        }
    }
    
    /**
     * Análise de infecção
     */
    public AIAnalysis performInfectionAnalysis(WoundImage woundImage, WoundAssessment assessment) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Simular análise de infecção (em produção, usar modelo real)
            Map<String, Object> infectionResults = machineLearningService.performInfectionAnalysis(
                woundImage.getOriginalImagePath(), assessment);
            
            AIAnalysis analysis = new AIAnalysis();
            analysis.setWoundImage(woundImage);
            analysis.setWoundAssessment(assessment);
            analysis.setAnalysisType(AIAnalysis.AnalysisType.INFECTION_ANALYSIS);
            analysis.setModelType(AIAnalysis.ModelType.VGG);
            analysis.setModelVersion("1.0.0");
            analysis.setAnalysisDate(LocalDateTime.now());
            
            // Extrair resultados da análise de infecção
            analysis.setPredictedInfectionRisk(
                AIAnalysis.InfectionRiskLevel.valueOf((String) infectionResults.get("riskLevel")));
            analysis.setInfectionRiskScore((Double) infectionResults.get("riskScore"));
            analysis.setHasErythema((Boolean) infectionResults.get("hasErythema"));
            analysis.setHasEdema((Boolean) infectionResults.get("hasEdema"));
            analysis.setHasPurulentExudate((Boolean) infectionResults.get("hasPurulentExudate"));
            analysis.setHasBiofilm((Boolean) infectionResults.get("hasBiofilm"));
            
            analysis.setProcessingTimeMs((double) (System.currentTimeMillis() - startTime));
            analysis.setOverallConfidence((Double) infectionResults.get("confidence"));
            analysis.setRawResults(infectionResults.toString());
            
            return aiAnalysisRepository.save(analysis);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro na análise de infecção: " + e.getMessage(), e);
        }
    }
    
    /**
     * Análise de umidade
     */
    public AIAnalysis performMoistureAnalysis(WoundImage woundImage, WoundAssessment assessment) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Simular análise de umidade (em produção, usar modelo real)
            Map<String, Object> moistureResults = machineLearningService.performMoistureAnalysis(
                woundImage.getOriginalImagePath(), assessment);
            
            AIAnalysis analysis = new AIAnalysis();
            analysis.setWoundImage(woundImage);
            analysis.setWoundAssessment(assessment);
            analysis.setAnalysisType(AIAnalysis.AnalysisType.MOISTURE_ANALYSIS);
            analysis.setModelType(AIAnalysis.ModelType.EFFICIENTNET);
            analysis.setModelVersion("1.0.0");
            analysis.setAnalysisDate(LocalDateTime.now());
            
            // Extrair resultados da análise de umidade
            analysis.setPredictedMoistureLevel(
                AIAnalysis.MoistureLevel.valueOf((String) moistureResults.get("moistureLevel")));
            analysis.setMoistureScore((Double) moistureResults.get("moistureScore"));
            analysis.setHasMaceration((Boolean) moistureResults.get("hasMaceration"));
            analysis.setHasDesiccation((Boolean) moistureResults.get("hasDesiccation"));
            
            analysis.setProcessingTimeMs((double) (System.currentTimeMillis() - startTime));
            analysis.setOverallConfidence((Double) moistureResults.get("confidence"));
            analysis.setRawResults(moistureResults.toString());
            
            return aiAnalysisRepository.save(analysis);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro na análise de umidade: " + e.getMessage(), e);
        }
    }
    
    /**
     * Análise de bordas
     */
    public AIAnalysis performEdgeAnalysis(WoundImage woundImage, WoundAssessment assessment) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Simular análise de bordas (em produção, usar modelo real)
            Map<String, Object> edgeResults = machineLearningService.performEdgeAnalysis(
                woundImage.getOriginalImagePath(), assessment);
            
            AIAnalysis analysis = new AIAnalysis();
            analysis.setWoundImage(woundImage);
            analysis.setWoundAssessment(assessment);
            analysis.setAnalysisType(AIAnalysis.AnalysisType.EDGE_ANALYSIS);
            analysis.setModelType(AIAnalysis.ModelType.VISION_TRANSFORMER);
            analysis.setModelVersion("1.0.0");
            analysis.setAnalysisDate(LocalDateTime.now());
            
            // Extrair resultados da análise de bordas
            analysis.setHasEpibole((Boolean) edgeResults.get("hasEpibole"));
            analysis.setEdgesAdvancing((Boolean) edgeResults.get("edgesAdvancing"));
            analysis.setContractionRate((Double) edgeResults.get("contractionRate"));
            analysis.setEdgeIrregularity((Double) edgeResults.get("edgeIrregularity"));
            
            analysis.setProcessingTimeMs((double) (System.currentTimeMillis() - startTime));
            analysis.setOverallConfidence((Double) edgeResults.get("confidence"));
            analysis.setRawResults(edgeResults.toString());
            
            return aiAnalysisRepository.save(analysis);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro na análise de bordas: " + e.getMessage(), e);
        }
    }
    
    /**
     * Predição de cicatrização
     */
    public AIAnalysis performHealingPrediction(WoundAssessment assessment, List<AIAnalysis> previousAnalyses) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Simular predição de cicatrização (em produção, usar modelo real)
            Map<String, Object> healingResults = machineLearningService.performHealingPrediction(
                assessment, previousAnalyses);
            
            AIAnalysis analysis = new AIAnalysis();
            analysis.setWoundAssessment(assessment);
            analysis.setAnalysisType(AIAnalysis.AnalysisType.HEALING_PREDICTION);
            analysis.setModelType(AIAnalysis.ModelType.RESNET);
            analysis.setModelVersion("1.0.0");
            analysis.setAnalysisDate(LocalDateTime.now());
            
            // Extrair resultados da predição
            analysis.setPredictedHealingTrajectory(
                AIAnalysis.HealingTrajectory.valueOf((String) healingResults.get("trajectory")));
            analysis.setEstimatedHealingDays((Integer) healingResults.get("estimatedDays"));
            analysis.setHealingProbability((Double) healingResults.get("healingProbability"));
            analysis.setHealingConfidence((Double) healingResults.get("confidence"));
            
            analysis.setProcessingTimeMs((double) (System.currentTimeMillis() - startTime));
            analysis.setOverallConfidence((Double) healingResults.get("confidence"));
            analysis.setRawResults(healingResults.toString());
            
            return aiAnalysisRepository.save(analysis);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro na predição de cicatrização: " + e.getMessage(), e);
        }
    }
    
    /**
     * Geração de recomendações de tratamento
     */
    public AIAnalysis generateTreatmentRecommendations(WoundAssessment assessment, List<AIAnalysis> analyses) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Simular geração de recomendações (em produção, usar modelo real)
            Map<String, Object> treatmentResults = machineLearningService.generateTreatmentRecommendations(
                assessment, analyses);
            
            AIAnalysis analysis = new AIAnalysis();
            analysis.setWoundAssessment(assessment);
            analysis.setAnalysisType(AIAnalysis.AnalysisType.TREATMENT_RECOMMENDATION);
            analysis.setModelType(AIAnalysis.ModelType.RESNET);
            analysis.setModelVersion("1.0.0");
            analysis.setAnalysisDate(LocalDateTime.now());
            
            // Extrair resultados das recomendações
            analysis.setTreatmentRecommendations((String) treatmentResults.get("recommendations"));
            analysis.setDressingRecommendations((String) treatmentResults.get("dressingRecommendations"));
            analysis.setNeedsDebridement((Boolean) treatmentResults.get("needsDebridement"));
            analysis.setNeedsAdvancedTherapy((Boolean) treatmentResults.get("needsAdvancedTherapy"));
            analysis.setNeedsSpecialistReferral((Boolean) treatmentResults.get("needsSpecialistReferral"));
            
            analysis.setProcessingTimeMs((double) (System.currentTimeMillis() - startTime));
            analysis.setOverallConfidence((Double) treatmentResults.get("confidence"));
            analysis.setRawResults(treatmentResults.toString());
            
            return aiAnalysisRepository.save(analysis);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro na geração de recomendações: " + e.getMessage(), e);
        }
    }
    
    /**
     * Criar análise abrangente
     */
    public AIAnalysis createComprehensiveAnalysis(WoundAssessment assessment, WoundImage woundImage, 
                                                 List<AIAnalysis> analyses) {
        AIAnalysis comprehensive = new AIAnalysis();
        comprehensive.setWoundAssessment(assessment);
        comprehensive.setWoundImage(woundImage);
        comprehensive.setAnalysisType(AIAnalysis.AnalysisType.COMPREHENSIVE_ANALYSIS);
        comprehensive.setModelType(AIAnalysis.ModelType.RESNET);
        comprehensive.setModelVersion("1.0.0");
        comprehensive.setAnalysisDate(LocalDateTime.now());
        
        // Consolidar resultados de todas as análises
        consolidateAnalysisResults(comprehensive, analyses);
        
        // Gerar explicação (XAI)
        generateExplanation(comprehensive, analyses);
        
        comprehensive.setProcessingTimeMs(analyses.stream()
            .mapToDouble(AIAnalysis::getProcessingTimeMs)
            .sum());
        
        return aiAnalysisRepository.save(comprehensive);
    }
    
    /**
     * Consolidar resultados das análises
     */
    private void consolidateAnalysisResults(AIAnalysis comprehensive, List<AIAnalysis> analyses) {
        // Consolidar métricas de segmentação
        analyses.stream()
            .filter(a -> a.getAnalysisType() == AIAnalysis.AnalysisType.WOUND_SEGMENTATION)
            .findFirst()
            .ifPresent(seg -> {
                comprehensive.setWoundArea(seg.getWoundArea());
                comprehensive.setWoundPerimeter(seg.getWoundPerimeter());
                comprehensive.setWoundDepth(seg.getWoundDepth());
            });
        
        // Consolidar classificação de tecidos
        analyses.stream()
            .filter(a -> a.getAnalysisType() == AIAnalysis.AnalysisType.TISSUE_CLASSIFICATION)
            .findFirst()
            .ifPresent(tissue -> {
                comprehensive.setGranulationPercentage(tissue.getGranulationPercentage());
                comprehensive.setSloughPercentage(tissue.getSloughPercentage());
                comprehensive.setNecrosisPercentage(tissue.getNecrosisPercentage());
                comprehensive.setEpithelialPercentage(tissue.getEpithelialPercentage());
            });
        
        // Consolidar análise de infecção
        analyses.stream()
            .filter(a -> a.getAnalysisType() == AIAnalysis.AnalysisType.INFECTION_ANALYSIS)
            .findFirst()
            .ifPresent(inf -> {
                comprehensive.setPredictedInfectionRisk(inf.getPredictedInfectionRisk());
                comprehensive.setInfectionRiskScore(inf.getInfectionRiskScore());
            });
        
        // Consolidar predição de cicatrização
        analyses.stream()
            .filter(a -> a.getAnalysisType() == AIAnalysis.AnalysisType.HEALING_PREDICTION)
            .findFirst()
            .ifPresent(healing -> {
                comprehensive.setPredictedHealingTrajectory(healing.getPredictedHealingTrajectory());
                comprehensive.setEstimatedHealingDays(healing.getEstimatedHealingDays());
                comprehensive.setHealingProbability(healing.getHealingProbability());
            });
        
        // Consolidar recomendações
        analyses.stream()
            .filter(a -> a.getAnalysisType() == AIAnalysis.AnalysisType.TREATMENT_RECOMMENDATION)
            .findFirst()
            .ifPresent(treatment -> {
                comprehensive.setTreatmentRecommendations(treatment.getTreatmentRecommendations());
                comprehensive.setDressingRecommendations(treatment.getDressingRecommendations());
                comprehensive.setNeedsAdvancedTherapy(treatment.getNeedsAdvancedTherapy());
                comprehensive.setNeedsSpecialistReferral(treatment.getNeedsSpecialistReferral());
            });
        
        // Calcular confiança geral
        double avgConfidence = analyses.stream()
            .mapToDouble(AIAnalysis::getOverallConfidence)
            .average()
            .orElse(0.0);
        comprehensive.setOverallConfidence(avgConfidence);
    }
    
    /**
     * Gerar explicação (XAI)
     */
    private void generateExplanation(AIAnalysis comprehensive, List<AIAnalysis> analyses) {
        StringBuilder explanation = new StringBuilder();
        StringBuilder keyFeatures = new StringBuilder();
        StringBuilder confidenceFactors = new StringBuilder();
        
        explanation.append("Análise abrangente de ferida baseada no framework TIMERS:\n\n");
        
        // Explicar cada componente
        analyses.forEach(analysis -> {
            switch (analysis.getAnalysisType()) {
                case WOUND_SEGMENTATION:
                    explanation.append("T - Tecido: Área da ferida identificada: ")
                        .append(String.format("%.2f cm²", analysis.getWoundArea()))
                        .append(", perímetro: ")
                        .append(String.format("%.2f cm", analysis.getWoundPerimeter()))
                        .append("\n");
                    break;
                case TISSUE_CLASSIFICATION:
                    explanation.append("Composição tecidual: Granulação ")
                        .append(String.format("%.1f%%", analysis.getGranulationPercentage()))
                        .append(", Esfacelo ")
                        .append(String.format("%.1f%%", analysis.getSloughPercentage()))
                        .append(", Necrose ")
                        .append(String.format("%.1f%%", analysis.getNecrosisPercentage()))
                        .append("\n");
                    break;
                case INFECTION_ANALYSIS:
                    explanation.append("I - Infecção: Risco ")
                        .append(analysis.getPredictedInfectionRisk())
                        .append(" (Score: ")
                        .append(String.format("%.2f", analysis.getInfectionRiskScore()))
                        .append(")\n");
                    break;
                case MOISTURE_ANALYSIS:
                    explanation.append("M - Umidade: Nível ")
                        .append(analysis.getPredictedMoistureLevel())
                        .append("\n");
                    break;
                case EDGE_ANALYSIS:
                    explanation.append("E - Borda: ")
                        .append(analysis.getEdgesAdvancing() ? "Avançando" : "Estagnada")
                        .append("\n");
                    break;
                case HEALING_PREDICTION:
                    explanation.append("R - Reparo: Trajetória ")
                        .append(analysis.getPredictedHealingTrajectory())
                        .append(", estimativa de cicatrização: ")
                        .append(analysis.getEstimatedHealingDays())
                        .append(" dias\n");
                    break;
            }
        });
        
        comprehensive.setExplanation(explanation.toString());
        comprehensive.setKeyFeatures(keyFeatures.toString());
        comprehensive.setConfidenceFactors(confidenceFactors.toString());
    }
    
    /**
     * Obter análises por avaliação
     */
    public List<AIAnalysis> getAnalysesByAssessment(WoundAssessment assessment) {
        return aiAnalysisRepository.findByWoundAssessment(assessment);
    }
    
    /**
     * Obter análise mais recente por tipo
     */
    public Optional<AIAnalysis> getLatestAnalysisByType(WoundAssessment assessment, 
                                                       AIAnalysis.AnalysisType type) {
        return aiAnalysisRepository.findLatestAnalysisByAssessmentAndType(assessment, type);
    }
}
