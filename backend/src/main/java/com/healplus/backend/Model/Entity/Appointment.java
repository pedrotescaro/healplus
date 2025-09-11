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
@Table(name = "appointments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Appointment {
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
    private LocalDateTime scheduledDateTime;
    
    @Column
    private LocalDateTime startDateTime;
    
    @Column
    private LocalDateTime endDateTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentType appointmentType = AppointmentType.IN_PERSON;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;
    
    @Column(length = 1000)
    private String reason; // Motivo da consulta
    
    @Column(length = 1000)
    private String notes; // Notas da consulta
    
    @Column(length = 1000)
    private String preparationInstructions; // Instruções de preparação
    
    @Column
    private Boolean isRecurring = false; // Se é uma consulta recorrente
    
    @Column
    private Integer recurrenceInterval; // Intervalo de recorrência em dias
    
    @Column
    private Integer maxRecurrences; // Número máximo de recorrências
    
    @Column
    private String meetingLink; // Link para teleconsulta
    
    @Column
    private String meetingId; // ID da reunião
    
    @Column
    private String meetingPassword; // Senha da reunião
    
    @Column
    private Double consultationFee; // Taxa da consulta
    
    @Column
    private Boolean isPaid = false; // Se foi pago
    
    @Column
    private LocalDateTime paymentDate; // Data do pagamento
    
    @Column(length = 100)
    private String paymentMethod; // Método de pagamento
    
    @Column(length = 100)
    private String paymentReference; // Referência do pagamento
    
    @Column
    private LocalDateTime reminderSentAt; // Quando o lembrete foi enviado
    
    @Column
    private LocalDateTime confirmationSentAt; // Quando a confirmação foi enviada
    
    @Column
    private LocalDateTime cancellationSentAt; // Quando o cancelamento foi enviado
    
    @Column(length = 500)
    private String cancellationReason; // Motivo do cancelamento
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum AppointmentType {
        IN_PERSON, TELEHEALTH, HYBRID
    }
    
    public enum AppointmentStatus {
        SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, 
        CANCELLED, NO_SHOW, RESCHEDULED
    }
}
