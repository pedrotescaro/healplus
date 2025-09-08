package com.healplus.backend.Service;

import com.healplus.backend.Model.Patient;
import com.healplus.backend.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    /**
     * Obter todos os pacientes
     */
    public List<Patient> getAllPatients() {
        try {
            return patientRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter paciente por ID
     */
    public Patient getPatientById(Long id) {
        try {
            return patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paciente não encontrado com ID: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter paciente: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter paciente por email
     */
    public Patient getPatientByEmail(String email) {
        try {
            return patientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Paciente não encontrado com email: " + email));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter paciente: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter paciente por CPF
     */
    public Patient getPatientByCpf(String cpf) {
        try {
            return patientRepository.findByCpf(cpf)
                .orElseThrow(() -> new IllegalArgumentException("Paciente não encontrado com CPF: " + cpf));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter paciente: " + e.getMessage(), e);
        }
    }
    
    /**
     * Criar novo paciente
     */
    public Patient createPatient(Patient patient) {
        try {
            // Validar se email já existe
            if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email já cadastrado: " + patient.getEmail());
            }
            
            // Validar se CPF já existe
            if (patientRepository.findByCpf(patient.getCpf()).isPresent()) {
                throw new IllegalArgumentException("CPF já cadastrado: " + patient.getCpf());
            }
            
            // Definir data de criação
            patient.setCreatedAt(LocalDateTime.now());
            
            return patientRepository.save(patient);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar paciente: " + e.getMessage(), e);
        }
    }
    
    /**
     * Atualizar paciente
     */
    public Patient updatePatient(Long id, Patient patient) {
        try {
            Patient existingPatient = getPatientById(id);
            
            // Validar se email já existe em outro paciente
            if (!existingPatient.getEmail().equals(patient.getEmail()) && 
                patientRepository.findByEmail(patient.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email já cadastrado: " + patient.getEmail());
            }
            
            // Validar se CPF já existe em outro paciente
            if (!existingPatient.getCpf().equals(patient.getCpf()) && 
                patientRepository.findByCpf(patient.getCpf()).isPresent()) {
                throw new IllegalArgumentException("CPF já cadastrado: " + patient.getCpf());
            }
            
            // Atualizar campos
            existingPatient.setName(patient.getName());
            existingPatient.setEmail(patient.getEmail());
            existingPatient.setCpf(patient.getCpf());
            existingPatient.setBirthDate(patient.getBirthDate());
            existingPatient.setGender(patient.getGender());
            existingPatient.setPhone(patient.getPhone());
            existingPatient.setEmergencyContact(patient.getEmergencyContact());
            existingPatient.setAddress(patient.getAddress());
            existingPatient.setCity(patient.getCity());
            existingPatient.setState(patient.getState());
            existingPatient.setZipCode(patient.getZipCode());
            
            // Fatores Sociais (S do TIMERS)
            existingPatient.setHealthLiteracy(patient.getHealthLiteracy());
            existingPatient.setTransportationAccess(patient.getTransportationAccess());
            existingPatient.setSocialSupport(patient.getSocialSupport());
            existingPatient.setMentalHealth(patient.getMentalHealth());
            existingPatient.setEconomicStatus(patient.getEconomicStatus());
            
            // Comorbidades
            existingPatient.setHasDiabetes(patient.getHasDiabetes());
            existingPatient.setHasHypertension(patient.getHasHypertension());
            existingPatient.setHasCardiovascularDisease(patient.getHasCardiovascularDisease());
            existingPatient.setHasPeripheralVascularDisease(patient.getHasPeripheralVascularDisease());
            existingPatient.setHasObesity(patient.getHasObesity());
            existingPatient.setHasSmokingHistory(patient.getHasSmokingHistory());
            existingPatient.setHasAlcoholHistory(patient.getHasAlcoholHistory());
            
            // Alergias e medicamentos
            existingPatient.setAllergies(patient.getAllergies());
            existingPatient.setCurrentMedications(patient.getCurrentMedications());
            
            existingPatient.setUpdatedAt(LocalDateTime.now());
            
            return patientRepository.save(existingPatient);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar paciente: " + e.getMessage(), e);
        }
    }
    
    /**
     * Deletar paciente
     */
    public void deletePatient(Long id) {
        try {
            Patient patient = getPatientById(id);
            patientRepository.delete(patient);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar paciente: " + e.getMessage(), e);
        }
    }
    
    /**
     * Buscar pacientes por nome
     */
    public List<Patient> searchPatientsByName(String name) {
        try {
            return patientRepository.findByNameContainingIgnoreCase(name);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar pacientes: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter pacientes por cidade
     */
    public List<Patient> getPatientsByCity(String city) {
        try {
            return patientRepository.findByCity(city);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes por cidade: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter pacientes por estado
     */
    public List<Patient> getPatientsByState(String state) {
        try {
            return patientRepository.findByState(state);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes por estado: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter pacientes com diabetes
     */
    public List<Patient> getPatientsWithDiabetes() {
        try {
            return patientRepository.findPatientsWithDiabetes();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes com diabetes: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter pacientes com hipertensão
     */
    public List<Patient> getPatientsWithHypertension() {
        try {
            return patientRepository.findPatientsWithHypertension();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes com hipertensão: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter pacientes com doença cardiovascular
     */
    public List<Patient> getPatientsWithCardiovascularDisease() {
        try {
            return patientRepository.findPatientsWithCardiovascularDisease();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes com doença cardiovascular: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter pacientes com doença vascular periférica
     */
    public List<Patient> getPatientsWithPeripheralVascularDisease() {
        try {
            return patientRepository.findPatientsWithPeripheralVascularDisease();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes com doença vascular periférica: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter pacientes com histórico de tabagismo
     */
    public List<Patient> getPatientsWithSmokingHistory() {
        try {
            return patientRepository.findPatientsWithSmokingHistory();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes com histórico de tabagismo: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter pacientes criados em um período
     */
    public List<Patient> getPatientsCreatedAfter(LocalDateTime startDate) {
        try {
            return patientRepository.findPatientsCreatedAfter(startDate);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes por data: " + e.getMessage(), e);
        }
    }
    
    /**
     * Contar pacientes por período
     */
    public Long countPatientsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return patientRepository.countPatientsByDateRange(startDate, endDate);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao contar pacientes: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter pacientes por localização
     */
    public List<Patient> getPatientsByLocation(String city, String state) {
        try {
            return patientRepository.findPatientsByLocation(city, state);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter pacientes por localização: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter cidades disponíveis
     */
    public List<String> getAvailableCities() {
        try {
            return patientRepository.findAllCities();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter cidades: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter estados disponíveis
     */
    public List<String> getAvailableStates() {
        try {
            return patientRepository.findAllStates();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter estados: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter estatísticas de pacientes
     */
    public Map<String, Object> getPatientStatistics() {
        try {
            Map<String, Object> statistics = new HashMap<>();
            
            // Estatísticas gerais
            long totalPatients = patientRepository.count();
            statistics.put("totalPatients", totalPatients);
            
            // Estatísticas por comorbidade
            statistics.put("patientsWithDiabetes", patientRepository.findPatientsWithDiabetes().size());
            statistics.put("patientsWithHypertension", patientRepository.findPatientsWithHypertension().size());
            statistics.put("patientsWithCardiovascularDisease", patientRepository.findPatientsWithCardiovascularDisease().size());
            statistics.put("patientsWithPeripheralVascularDisease", patientRepository.findPatientsWithPeripheralVascularDisease().size());
            statistics.put("patientsWithSmokingHistory", patientRepository.findPatientsWithSmokingHistory().size());
            
            // Estatísticas por gênero
            List<Patient> allPatients = patientRepository.findAll();
            Map<Patient.Gender, Long> genderStats = allPatients.stream()
                .collect(Collectors.groupingBy(Patient::getGender, Collectors.counting()));
            statistics.put("genderDistribution", genderStats);
            
            // Estatísticas por localização
            statistics.put("totalCities", patientRepository.findAllCities().size());
            statistics.put("totalStates", patientRepository.findAllStates().size());
            
            // Estatísticas por período (últimos 30 dias)
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            long newPatientsLast30Days = patientRepository.countPatientsByDateRange(thirtyDaysAgo, LocalDateTime.now());
            statistics.put("newPatientsLast30Days", newPatientsLast30Days);
            
            return statistics;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter estatísticas: " + e.getMessage(), e);
        }
    }
    
    /**
     * Validar dados do paciente
     */
    public void validatePatient(Patient patient) {
        if (patient.getName() == null || patient.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        
        if (patient.getEmail() == null || patient.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        
        if (patient.getCpf() == null || patient.getCpf().trim().isEmpty()) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }
        
        if (patient.getBirthDate() == null) {
            throw new IllegalArgumentException("Data de nascimento é obrigatória");
        }
        
        if (patient.getGender() == null) {
            throw new IllegalArgumentException("Gênero é obrigatório");
        }
        
        // Validar formato do email
        if (!patient.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Formato de email inválido");
        }
        
        // Validar formato do CPF (simplificado)
        if (!patient.getCpf().matches("^\\d{11}$")) {
            throw new IllegalArgumentException("CPF deve conter 11 dígitos");
        }
    }
}
