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
    @GeneratedValue(strategy = GenerationType.AUTO)
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
    
    // Getters e Setters explícitos para resolver problemas do Lombok
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    
    public CheckInType getType() { return type; }
    public void setType(CheckInType type) { this.type = type; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
    
    public String getImageAnalysis() { return imageAnalysis; }
    public void setImageAnalysis(String imageAnalysis) { this.imageAnalysis = imageAnalysis; }
    
    public String getAppearanceRating() { return appearanceRating; }
    public void setAppearanceRating(String appearanceRating) { this.appearanceRating = appearanceRating; }
    
    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }
    
    public Integer getPainLevel() { return painLevel; }
    public void setPainLevel(Integer painLevel) { this.painLevel = painLevel; }
    
    public List<String> getMedications() { return medications; }
    public void setMedications(List<String> medications) { this.medications = medications; }
    
    public String getMedicationNotes() { return medicationNotes; }
    public void setMedicationNotes(String medicationNotes) { this.medicationNotes = medicationNotes; }
    
    public String getAiAnalysisResults() { return aiAnalysisResults; }
    public void setAiAnalysisResults(String aiAnalysisResults) { this.aiAnalysisResults = aiAnalysisResults; }
    
    public Double getRiskScore() { return riskScore; }
    public void setRiskScore(Double riskScore) { this.riskScore = riskScore; }
    
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    
    public LocalDateTime getCheckinTime() { return checkinTime; }
    public void setCheckinTime(LocalDateTime checkinTime) { this.checkinTime = checkinTime; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public CheckInStatus getStatus() { return status; }
    public void setStatus(CheckInStatus status) { this.status = status; }
    
    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    
    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
    
    public enum RiskLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}
