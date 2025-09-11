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
@Table(name = "remote_checkins")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor @ToString
public class RemoteCheckIn {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CheckInType type;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "image_path")
    private String imagePath;
    
    @Column(name = "image_analysis")
    private String imageAnalysis;
    
    // Symptom-specific fields
    @Column(name = "appearance_rating")
    private String appearanceRating;
    
    @ElementCollection
    @CollectionTable(name = "checkin_symptoms", joinColumns = @JoinColumn(name = "checkin_id"))
    @Column(name = "symptom")
    private List<String> symptoms;
    
    @Column(name = "pain_level")
    private Integer painLevel;
    
    // Medication-specific fields
    @ElementCollection
    @CollectionTable(name = "checkin_medications", joinColumns = @JoinColumn(name = "checkin_id"))
    @Column(name = "medication")
    private List<String> medications;
    
    @Column(name = "medication_notes")
    private String medicationNotes;
    
    // AI Analysis results
    @Column(name = "ai_analysis_results")
    private String aiAnalysisResults;
    
    @Column(name = "risk_score")
    private Double riskScore;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevel riskLevel;
    
    @Column(name = "recommendations")
    private String recommendations;
    
    // Timestamps
    @Column(name = "checkin_time", nullable = false)
    private LocalDateTime checkinTime;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CheckInStatus status;
    
    @Column(name = "reviewed_by")
    private String reviewedBy;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @Column(name = "review_notes")
    private String reviewNotes;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        checkinTime = LocalDateTime.now();
        status = CheckInStatus.PENDING;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum CheckInType {
        PHOTO,
        SYMPTOMS,
        MEDICATION,
        PAIN_ASSESSMENT,
        GENERAL
    }
    
    public enum CheckInStatus {
        PENDING,
        REVIEWED,
        REQUIRES_ATTENTION,
        ESCALATED,
        RESOLVED
    }
    
    public enum RiskLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}
