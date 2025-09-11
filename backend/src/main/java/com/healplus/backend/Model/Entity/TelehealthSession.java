package com.healplus.backend.Model.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "telehealth_sessions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TelehealthSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_id", nullable = false)
    private Professional professional;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @Column(nullable = false)
    private LocalDateTime scheduledStartTime;
    
    @Column
    private LocalDateTime actualStartTime;
    
    @Column
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.SCHEDULED;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionType sessionType = SessionType.CONSULTATION;
    
    @Column(length = 1000)
    private String reason; // Motivo da sessão
    
    @Column(length = 2000)
    private String notes; // Notas da sessão
    
    @Column(length = 2000)
    private String summary; // Resumo da sessão
    
    @Column(length = 1000)
    private String recommendations; // Recomendações
    
    @Column(length = 1000)
    private String followUpInstructions; // Instruções de acompanhamento
    
    @Column
    private String meetingRoomId; // ID da sala de reunião
    
    @Column
    private String meetingUrl; // URL da reunião
    
    @Column
    private String recordingUrl; // URL da gravação (se autorizada)
    
    @Column
    private Boolean isRecorded = false; // Se foi gravada
    
    @Column
    private Boolean patientConsentGiven = false; // Consentimento do paciente
    
    @Column
    private Integer videoQuality; // Qualidade do vídeo (1-5)
    
    @Column
    private Integer audioQuality; // Qualidade do áudio (1-5)
    
    @Column
    private Integer connectionStability; // Estabilidade da conexão (1-5)
    
    @Column
    private Boolean technicalIssues = false; // Problemas técnicos
    
    @Column(length = 500)
    private String technicalIssuesDescription; // Descrição dos problemas técnicos
    
    @Column
    private Integer patientSatisfaction; // Satisfação do paciente (1-5)
    
    @Column
    private Integer clinicianSatisfaction; // Satisfação do clínico (1-5)
    
    @Column(length = 1000)
    private String patientFeedback; // Feedback do paciente
    
    @Column(length = 1000)
    private String clinicianFeedback; // Feedback do clínico
    
    @Column
    private Double sessionDuration; // Duração da sessão em minutos
    
    @Column
    private Boolean requiresFollowUp = false; // Requer acompanhamento
    
    @Column
    private LocalDateTime followUpScheduledDate; // Data do acompanhamento agendado
    
    @Column
    private Boolean prescriptionIssued = false; // Se foi emitida prescrição
    
    @Column
    private Boolean referralIssued = false; // Se foi emitido encaminhamento
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum SessionStatus {
        SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, 
        NO_SHOW, TECHNICAL_FAILURE
    }
    
    public enum SessionType {
        CONSULTATION, FOLLOW_UP, EMERGENCY, SECOND_OPINION, 
        EDUCATION, ASSESSMENT
    }
}
