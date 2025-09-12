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
@Table(name = "professionals")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Professional {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(unique = true, nullable = false)
    private String crm; // Conselho Regional de Medicina
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProfessionalType professionalType;
    
    @Column(length = 100)
    private String specialization; // Especialização
    
    @Column(length = 15)
    private String phone;
    
    @Column(length = 500)
    private String address;
    
    @Column(length = 100)
    private String city;
    
    @Column(length = 2)
    private String state;
    
    @Column(length = 10)
    private String zipCode;
    
    @Column
    private Boolean isActive = true;
    
    @Column
    private Boolean isAvailableForTelehealth = false;
    
    @Column
    private Double consultationFee; // Taxa de consulta
    
    @Column(length = 1000)
    private String bio; // Biografia profissional
    
    @Column(length = 1000)
    private String qualifications; // Qualificações
    
    @Column
    private Integer yearsOfExperience; // Anos de experiência
    
    @Column
    private LocalDateTime lastLogin;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "professional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WoundAssessment> woundAssessments;
    
    @OneToMany(mappedBy = "professional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;
    
    @OneToMany(mappedBy = "professional", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TelehealthSession> telehealthSessions;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum ProfessionalType {
        DOCTOR, NURSE, WOUND_CARE_SPECIALIST, DERMATOLOGIST, 
        PLASTIC_SURGEON, GENERAL_PRACTITIONER
    }
}
