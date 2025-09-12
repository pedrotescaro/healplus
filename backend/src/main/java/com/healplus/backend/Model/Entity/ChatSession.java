package com.healplus.backend.Model.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "chat_sessions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_id")
    private Professional professional;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionType sessionType = SessionType.PATIENT_SUPPORT;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.ACTIVE;
    
    @Column(length = 100)
    private String sessionId; // ID único da sessão
    
    @Column(length = 500)
    private String context; // Contexto da conversa
    
    @Column(length = 1000)
    private String initialQuery; // Consulta inicial
    
    @Column
    private Integer messageCount = 0; // Número de mensagens
    
    @Column
    private LocalDateTime lastActivity = LocalDateTime.now();
    
    @Column
    private LocalDateTime startedAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime endedAt;
    
    @Column
    private Integer satisfactionRating; // Avaliação de satisfação (1-5)
    
    @Column(length = 1000)
    private String feedback; // Feedback do usuário
    
    @Column
    private Boolean escalatedToHuman = false; // Se foi escalado para humano
    
    @Column
    private LocalDateTime escalatedAt; // Quando foi escalado
    
    @Column(length = 1000)
    private String escalationReason; // Motivo da escalação
    
    @Column
    private Boolean resolved = false; // Se foi resolvido
    
    @Column(length = 1000)
    private String resolution; // Resolução do problema
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "chatSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChatMessage> messages;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum SessionType {
        PATIENT_SUPPORT, CLINICIAN_ASSISTANCE, SYMPTOM_TRIAGE, 
        MEDICATION_REMINDER, EDUCATION, APPOINTMENT_SCHEDULING
    }
    
    public enum SessionStatus {
        ACTIVE, PAUSED, ENDED, ESCALATED, RESOLVED
    }
}
