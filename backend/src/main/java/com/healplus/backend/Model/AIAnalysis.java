package com.healplus.backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AIAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wound_assessment_id")
    private WoundAssessment woundAssessment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wound_image_id")
    private WoundImage woundImage;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnalysisType analysisType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModelType modelType;
    
    @Column(length = 100)
    private String modelVersion; // Versão do modelo usado
    
    @Column(nullable = false)
    private LocalDateTime analysisDate = LocalDateTime.now();
    
    // Resultados da Segmentação
    @Column
    private Double woundArea; // Área da ferida em cm²
    
    @Column
    private Double woundPerimeter; // Perímetro da ferida em cm
    
    @Column
    private Double woundDepth; // Profundidade estimada em cm
    
    @Column
    private String woundShape; // Forma da ferida
    
    // Resultados da Classificação de Tecidos
    @Column
    private Double granulationPercentage = 0.0;
    
    @Column
    private Double sloughPercentage = 0.0;
    
    @Column
    private Double necrosisPercentage = 0.0;
    
    @Column
    private Double epithelialPercentage = 0.0;
    
    @Column
    private Double healthySkinPercentage = 0.0;
    
    // Análise de Infecção
    @Enumerated(EnumType.STRING)
    @Column
    private InfectionRiskLevel predictedInfectionRisk;
    
    @Column
    private Double infectionRiskScore; // Score de risco (0-1)
    
    @Column
    private Boolean hasErythema = false;
    
    @Column
    private Boolean hasEdema = false;
    
    @Column
    private Boolean hasPurulentExudate = false;
    
    @Column
    private Boolean hasBiofilm = false;
    
    // Análise de Umidade
    @Enumerated(EnumType.STRING)
    @Column
    private MoistureLevel predictedMoistureLevel;
    
    @Column
    private Double moistureScore; // Score de umidade (0-1)
    
    @Column
    private Boolean hasMaceration = false;
    
    @Column
    private Boolean hasDesiccation = false;
    
    // Análise de Bordas
    @Column
    private Boolean hasEpibole = false;
    
    @Column
    private Boolean edgesAdvancing = true;
    
    @Column
    private Double contractionRate; // Taxa de contração
    
    @Column
    private Double edgeIrregularity; // Irregularidade das bordas (0-1)
    
    // Predição de Cicatrização
    @Enumerated(EnumType.STRING)
    @Column
    private HealingTrajectory predictedHealingTrajectory;
    
    @Column
    private Integer estimatedHealingDays; // Dias estimados para cicatrização
    
    @Column
    private Double healingProbability; // Probabilidade de cicatrização (0-1)
    
    @Column
    private Double healingConfidence; // Confiança na predição (0-1)
    
    // Recomendações de Tratamento
    @Column(length = 2000)
    private String treatmentRecommendations; // Recomendações de tratamento
    
    @Column(length = 1000)
    private String dressingRecommendations; // Recomendações de curativos
    
    @Column
    private Boolean needsDebridement = false;
    
    @Column
    private Boolean needsAdvancedTherapy = false;
    
    @Column
    private Boolean needsSpecialistReferral = false;
    
    // Explicabilidade (XAI)
    @Column(length = 2000)
    private String explanation; // Explicação da análise
    
    @Column(length = 1000)
    private String keyFeatures; // Características-chave identificadas
    
    @Column(length = 1000)
    private String confidenceFactors; // Fatores de confiança
    
    @Column(length = 1000)
    private String limitations; // Limitações da análise
    
    // Metadados Técnicos
    @Column
    private Double processingTimeMs; // Tempo de processamento em ms
    
    @Column
    private String inputImageHash; // Hash da imagem de entrada
    
    @Column
    private String outputImagePath; // Caminho da imagem de saída
    
    @Column
    private String heatmapPath; // Caminho do mapa de calor
    
    @Column
    private String segmentationMaskPath; // Caminho da máscara de segmentação
    
    @Column(length = 2000)
    private String rawResults; // Resultados brutos do modelo (JSON)
    
    @Column
    private Double overallConfidence; // Confiança geral (0-1)
    
    @Column
    private Boolean isReviewed = false; // Se foi revisado por especialista
    
    @Column
    private LocalDateTime reviewedAt; // Quando foi revisado
    
    @Column(length = 1000)
    private String reviewNotes; // Notas da revisão
    
    @Column
    private Boolean isApproved = false; // Se foi aprovado
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum AnalysisType {
        WOUND_SEGMENTATION, TISSUE_CLASSIFICATION, INFECTION_ANALYSIS,
        MOISTURE_ANALYSIS, EDGE_ANALYSIS, HEALING_PREDICTION,
        TREATMENT_RECOMMENDATION, COMPREHENSIVE_ANALYSIS
    }
    
    public enum ModelType {
        U_NET, RESNET, VGG, MOBILENET, EFFICIENTNET, VISION_TRANSFORMER
    }
    
    public enum InfectionRiskLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }
    
    public enum MoistureLevel {
        DRY, BALANCED, MOIST, WET, VERY_WET
    }
    
    public enum HealingTrajectory {
        IMPROVING, STABLE, DECLINING, STAGNANT
    }
}
