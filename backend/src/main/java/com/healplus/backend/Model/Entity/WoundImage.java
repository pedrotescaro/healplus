package com.healplus.backend.Model.Entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wound_images")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class WoundImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wound_assessment_id", nullable = false)
    private WoundAssessment woundAssessment;
    
    @Column(nullable = false)
    private String originalImagePath; // Caminho da imagem original
    
    @Column
    private String segmentedImagePath; // Caminho da imagem segmentada
    
    @Column
    private String heatmapImagePath; // Caminho do mapa de calor
    
    @Column
    private String thumbnailPath; // Caminho da miniatura
    
    @Column
    private Long fileSize; // Tamanho do arquivo em bytes
    
    @Column(length = 50)
    private String fileType; // Tipo do arquivo (JPEG, PNG, etc.)
    
    @Column
    private Integer width; // Largura da imagem em pixels
    
    @Column
    private Integer height; // Altura da imagem em pixels
    
    @Column
    private Double dpi; // DPI da imagem
    
    @Column
    private Boolean isProcessed = false; // Se a imagem foi processada pela IA
    
    @Column
    private Double processingConfidence; // Confiança do processamento (0-1)
    
    @Column(length = 1000)
    private String aiAnalysis; // Análise da IA sobre a imagem
    
    @Column(length = 500)
    private String metadata; // Metadados da imagem (JSON)
    
    @Column(nullable = false)
    private LocalDateTime capturedAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime processedAt;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
