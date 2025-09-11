package com.healplus.backend.Model.Entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "wound_assessments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class WoundAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_id", nullable = false)
    private Professional professional;
    
    @Column(nullable = false)
    private LocalDateTime assessmentDate = LocalDateTime.now();
    
    @Column(length = 500)
    private String woundLocation; // Localização da ferida
    
    @Column(length = 1000)
    private String woundDescription; // Descrição geral da ferida
    
    // T - Tissue (Tecido)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TissueType primaryTissueType;
    
    @Column
    private Double granulationPercentage = 0.0; // % de tecido de granulação
    
    @Column
    private Double sloughPercentage = 0.0; // % de esfacelo
    
    @Column
    private Double necrosisPercentage = 0.0; // % de tecido necrótico
    
    @Column
    private Double epithelialPercentage = 0.0; // % de tecido epitelial
    
    @Column
    private Boolean needsDebridement = false; // Necessita desbridamento
    
    // I - Infection/Inflammation (Infecção/Inflamação)
    @Column
    private Boolean hasErythema = false; // Eritema
    
    @Column
    private Boolean hasEdema = false; // Edema
    
    @Column
    private Boolean hasPurulentExudate = false; // Exsudato purulento
    
    @Column
    private Boolean hasOdor = false; // Odor
    
    @Column
    private Boolean hasBiofilm = false; // Biofilme
    
    @Column
    private Double temperature; // Temperatura da ferida
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InfectionRiskLevel infectionRiskLevel = InfectionRiskLevel.LOW;
    
    // M - Moisture Imbalance (Desequilíbrio de Umidade)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MoistureLevel moistureLevel = MoistureLevel.BALANCED;
    
    @Column(length = 500)
    private String exudateDescription; // Descrição do exsudato
    
    @Column
    private Boolean maceration = false; // Maceração
    
    @Column
    private Boolean desiccation = false; // Dessecação
    
    // E - Edge of Wound (Borda da Ferida)
    @Column
    private Double woundArea; // Área da ferida em cm²
    
    @Column
    private Double woundPerimeter; // Perímetro da ferida em cm
    
    @Column
    private Double woundDepth; // Profundidade da ferida em cm
    
    @Column
    private Boolean hasEpibole = false; // Epíbole
    
    @Column
    private Boolean edgesAdvancing = true; // Bordas avançando
    
    @Column
    private Boolean edgesStagnant = false; // Bordas estagnadas
    
    @Column
    private Double contractionRate; // Taxa de contração
    
    // R - Repair/Regeneration/Refer (Reparo/Regeneração/Encaminhamento)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HealingTrajectory healingTrajectory = HealingTrajectory.IMPROVING;
    
    @Column
    private Integer estimatedHealingDays; // Dias estimados para cicatrização
    
    @Column
    private Boolean needsAdvancedTherapy = false; // Necessita terapia avançada
    
    @Column
    private Boolean needsSpecialistReferral = false; // Necessita encaminhamento
    
    @Column(length = 1000)
    private String treatmentRecommendations; // Recomendações de tratamento
    
    // S - Social/Self-Care (Social/Autocuidado)
    @Column
    private Boolean patientCompliant = true; // Paciente aderente
    
    @Column
    private Boolean hasTransportationIssues = false; // Problemas de transporte
    
    @Column
    private Boolean hasFinancialBarriers = false; // Barreiras financeiras
    
    @Column
    private Boolean hasSocialSupport = true; // Apoio social
    
    @Column
    private Integer painLevel; // Nível de dor (0-10)
    
    @Column(length = 1000)
    private String socialFactorsNotes; // Notas sobre fatores sociais
    
    // Análise de IA
    @Column(length = 2000)
    private String aiAnalysis; // Análise da IA
    
    @Column
    private Double aiConfidenceScore; // Score de confiança da IA (0-1)
    
    @Column(length = 1000)
    private String aiRecommendations; // Recomendações da IA
    
    @Column
    private String woundImagePath; // Caminho da imagem da ferida
    
    @Column
    private String segmentedImagePath; // Caminho da imagem segmentada
    
    @Column
    private String heatmapImagePath; // Caminho do mapa de calor
    
    @Column(length = 2000)
    private String clinicalNotes; // Notas clínicas
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "woundAssessment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WoundImage> woundImages;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum TissueType {
        GRANULATION, SLOUGH, NECROSIS, EPITHELIAL, MIXED
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
