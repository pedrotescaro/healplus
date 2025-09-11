package com.healplus.backend.Model.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "patients")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(unique = true, nullable = false)
    private String cpf;
    
    @Column(nullable = false)
    private LocalDate birthDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;
    
    @Column(length = 15)
    private String phone;
    
    @Column(length = 15)
    private String emergencyContact;
    
    @Column(length = 500)
    private String address;
    
    @Column(length = 100)
    private String city;
    
    @Column(length = 2)
    private String state;
    
    @Column(length = 10)
    private String zipCode;
    
    // Fatores Sociais (S do TIMERS)
    @Column(length = 500)
    private String healthLiteracy; // Literacia em saúde
    
    @Column(length = 500)
    private String transportationAccess; // Acesso a transporte
    
    @Column(length = 500)
    private String socialSupport; // Apoio social
    
    @Column(length = 500)
    private String mentalHealth; // Saúde mental
    
    @Column(length = 500)
    private String economicStatus; // Status econômico
    
    // Comorbidades
    @Column
    private Boolean hasDiabetes = false;
    
    @Column
    private Boolean hasHypertension = false;
    
    @Column
    private Boolean hasCardiovascularDisease = false;
    
    @Column
    private Boolean hasPeripheralVascularDisease = false;
    
    @Column
    private Boolean hasObesity = false;
    
    @Column
    private Boolean hasSmokingHistory = false;
    
    @Column
    private Boolean hasAlcoholHistory = false;
    
    // Alergias
    @Column(length = 1000)
    private String allergies;
    
    // Medicamentos atuais
    @Column(length = 1000)
    private String currentMedications;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WoundAssessment> woundAssessments;
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum Gender {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }
}
