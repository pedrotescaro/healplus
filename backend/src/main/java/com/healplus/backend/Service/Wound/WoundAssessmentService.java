package com.healplus.backend.Service;

import com.healplus.backend.Model.*;
import com.healplus.backend.Repository.WoundAssessmentRepository;
import com.healplus.backend.Repository.PatientRepository;
import com.healplus.backend.Repository.ClinicianRepository;
import com.healplus.backend.Repository.WoundImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class WoundAssessmentService {
    
    @Autowired
    private WoundAssessmentRepository woundAssessmentRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private ClinicianRepository clinicianRepository;
    
    @Autowired
    private WoundImageRepository woundImageRepository;
    
    @Autowired
    private ImageProcessingService imageProcessingService;
    
    /**
     * Obter todas as avaliações
     */
    public List<WoundAssessment> getAllAssessments() {
        try {
            return woundAssessmentRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliações: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter avaliação por ID
     */
    public WoundAssessment getAssessmentById(UUID id) {
        try {
            return woundAssessmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Avaliação não encontrada com ID: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliação: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter avaliações por paciente
     */
    public List<WoundAssessment> getAssessmentsByPatient(UUID patientId) {
        try {
            Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Paciente não encontrado com ID: " + patientId));
            return woundAssessmentRepository.findByPatientOrderByAssessmentDateDesc(patient);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliações do paciente: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter avaliações por clínico
     */
    public List<WoundAssessment> getAssessmentsByClinician(UUID clinicianId) {
        try {
            Clinician clinician = clinicianRepository.findById(clinicianId)
                .orElseThrow(() -> new IllegalArgumentException("Clínico não encontrado com ID: " + clinicianId));
            return woundAssessmentRepository.findByClinicianOrderByAssessmentDateDesc(clinician);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliações do clínico: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter avaliação mais recente por paciente
     */
    public WoundAssessment getLatestAssessmentByPatient(UUID patientId) {
        try {
            Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Paciente não encontrado com ID: " + patientId));
            return woundAssessmentRepository.findLatestAssessmentByPatient(patient)
                .orElseThrow(() -> new IllegalArgumentException("Nenhuma avaliação encontrada para o paciente"));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliação mais recente: " + e.getMessage(), e);
        }
    }
    
    /**
     * Criar nova avaliação
     */
    public WoundAssessment createAssessment(WoundAssessment assessment) {
        try {
            // Validar paciente
            Patient patient = patientRepository.findById(assessment.getPatient().getId())
                .orElseThrow(() -> new IllegalArgumentException("Paciente não encontrado"));
            assessment.setPatient(patient);
            
            // Validar clínico
            Clinician clinician = clinicianRepository.findById(assessment.getClinician().getId())
                .orElseThrow(() -> new IllegalArgumentException("Clínico não encontrado"));
            assessment.setClinician(clinician);
            
            // Definir data de avaliação
            if (assessment.getAssessmentDate() == null) {
                assessment.setAssessmentDate(LocalDateTime.now());
            }
            
            // Validar dados da avaliação
            validateAssessment(assessment);
            
            // Calcular métricas derivadas
            calculateDerivedMetrics(assessment);
            
            assessment.setCreatedAt(LocalDateTime.now());
            
            return woundAssessmentRepository.save(assessment);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar avaliação: " + e.getMessage(), e);
        }
    }
    
    /**
     * Atualizar avaliação
     */
    public WoundAssessment updateAssessment(UUID id, WoundAssessment assessment) {
        try {
            WoundAssessment existingAssessment = getAssessmentById(id);
            
            // Atualizar campos básicos
            existingAssessment.setWoundLocation(assessment.getWoundLocation());
            existingAssessment.setWoundDescription(assessment.getWoundDescription());
            
            // T - Tissue
            existingAssessment.setPrimaryTissueType(assessment.getPrimaryTissueType());
            existingAssessment.setGranulationPercentage(assessment.getGranulationPercentage());
            existingAssessment.setSloughPercentage(assessment.getSloughPercentage());
            existingAssessment.setNecrosisPercentage(assessment.getNecrosisPercentage());
            existingAssessment.setEpithelialPercentage(assessment.getEpithelialPercentage());
            existingAssessment.setNeedsDebridement(assessment.getNeedsDebridement());
            
            // I - Infection
            existingAssessment.setHasErythema(assessment.getHasErythema());
            existingAssessment.setHasEdema(assessment.getHasEdema());
            existingAssessment.setHasPurulentExudate(assessment.getHasPurulentExudate());
            existingAssessment.setHasOdor(assessment.getHasOdor());
            existingAssessment.setHasBiofilm(assessment.getHasBiofilm());
            existingAssessment.setTemperature(assessment.getTemperature());
            existingAssessment.setInfectionRiskLevel(assessment.getInfectionRiskLevel());
            
            // M - Moisture
            existingAssessment.setMoistureLevel(assessment.getMoistureLevel());
            existingAssessment.setExudateDescription(assessment.getExudateDescription());
            existingAssessment.setMaceration(assessment.getMaceration());
            existingAssessment.setDesiccation(assessment.getDesiccation());
            
            // E - Edge
            existingAssessment.setWoundArea(assessment.getWoundArea());
            existingAssessment.setWoundPerimeter(assessment.getWoundPerimeter());
            existingAssessment.setWoundDepth(assessment.getWoundDepth());
            existingAssessment.setHasEpibole(assessment.getHasEpibole());
            existingAssessment.setEdgesAdvancing(assessment.getEdgesAdvancing());
            existingAssessment.setEdgesStagnant(assessment.getEdgesStagnant());
            existingAssessment.setContractionRate(assessment.getContractionRate());
            
            // R - Repair
            existingAssessment.setHealingTrajectory(assessment.getHealingTrajectory());
            existingAssessment.setEstimatedHealingDays(assessment.getEstimatedHealingDays());
            existingAssessment.setNeedsAdvancedTherapy(assessment.getNeedsAdvancedTherapy());
            existingAssessment.setNeedsSpecialistReferral(assessment.getNeedsSpecialistReferral());
            existingAssessment.setTreatmentRecommendations(assessment.getTreatmentRecommendations());
            
            // S - Social
            existingAssessment.setPatientCompliant(assessment.getPatientCompliant());
            existingAssessment.setHasTransportationIssues(assessment.getHasTransportationIssues());
            existingAssessment.setHasFinancialBarriers(assessment.getHasFinancialBarriers());
            existingAssessment.setHasSocialSupport(assessment.getHasSocialSupport());
            existingAssessment.setPainLevel(assessment.getPainLevel());
            existingAssessment.setSocialFactorsNotes(assessment.getSocialFactorsNotes());
            
            // Análise de IA
            existingAssessment.setAiAnalysis(assessment.getAiAnalysis());
            existingAssessment.setAiConfidenceScore(assessment.getAiConfidenceScore());
            existingAssessment.setAiRecommendations(assessment.getAiRecommendations());
            
            // Notas clínicas
            existingAssessment.setClinicalNotes(assessment.getClinicalNotes());
            
            existingAssessment.setUpdatedAt(LocalDateTime.now());
            
            // Recalcular métricas derivadas
            calculateDerivedMetrics(existingAssessment);
            
            return woundAssessmentRepository.save(existingAssessment);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar avaliação: " + e.getMessage(), e);
        }
    }
    
    /**
     * Deletar avaliação
     */
    public void deleteAssessment(UUID id) {
        try {
            WoundAssessment assessment = getAssessmentById(id);
            woundAssessmentRepository.delete(assessment);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar avaliação: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter avaliações por nível de risco de infecção
     */
    public List<WoundAssessment> getAssessmentsByInfectionRisk(WoundAssessment.InfectionRiskLevel riskLevel) {
        try {
            return woundAssessmentRepository.findByInfectionRiskLevel(riskLevel);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliações por risco de infecção: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter avaliações por trajetória de cicatrização
     */
    public List<WoundAssessment> getAssessmentsByHealingTrajectory(WoundAssessment.HealingTrajectory trajectory) {
        try {
            return woundAssessmentRepository.findByHealingTrajectory(trajectory);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliações por trajetória: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter avaliações que necessitam terapia avançada
     */
    public List<WoundAssessment> getAssessmentsNeedingAdvancedTherapy() {
        try {
            return woundAssessmentRepository.findAssessmentsNeedingAdvancedTherapy();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliações que necessitam terapia avançada: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter avaliações que necessitam encaminhamento
     */
    public List<WoundAssessment> getAssessmentsNeedingSpecialistReferral() {
        try {
            return woundAssessmentRepository.findAssessmentsNeedingSpecialistReferral();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliações que necessitam encaminhamento: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter histórico de avaliações por paciente e localização
     */
    public List<WoundAssessment> getAssessmentHistoryByPatientAndLocation(UUID patientId, String location) {
        try {
            Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Paciente não encontrado com ID: " + patientId));
            
            LocalDateTime startDate = LocalDateTime.now().minusMonths(6); // Últimos 6 meses
            return woundAssessmentRepository.findAssessmentHistoryByPatientAndLocation(patient, location, startDate);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter histórico de avaliações: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter avaliações por período
     */
    public List<WoundAssessment> getAssessmentsByDateRange(String startDateStr, String endDateStr) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime startDate = LocalDateTime.parse(startDateStr + " 00:00:00", formatter);
            LocalDateTime endDate = LocalDateTime.parse(endDateStr + " 23:59:59", formatter);
            
            return woundAssessmentRepository.findByDateRange(startDate, endDate);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter avaliações por período: " + e.getMessage(), e);
        }
    }
    
    /**
     * Upload de imagem para avaliação
     */
    public Map<String, Object> uploadImage(WoundAssessment assessment, MultipartFile imageFile) {
        try {
            WoundImage woundImage = imageProcessingService.processAndSaveImage(assessment, imageFile);
            
            Map<String, Object> result = new HashMap<>();
            result.put("imageId", woundImage.getId());
            result.put("imagePath", woundImage.getOriginalImagePath());
            result.put("thumbnailPath", woundImage.getThumbnailPath());
            result.put("message", "Imagem carregada com sucesso");
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload da imagem: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter imagens de uma avaliação
     */
    public List<WoundImage> getAssessmentImages(WoundAssessment assessment) {
        try {
            return woundImageRepository.findByWoundAssessmentOrderByCapturedAtDesc(assessment);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter imagens da avaliação: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obter estatísticas de avaliações
     */
    public Map<String, Object> getAssessmentStatistics() {
        try {
            Map<String, Object> statistics = new HashMap<>();
            
            // Estatísticas gerais
            long totalAssessments = woundAssessmentRepository.count();
            statistics.put("totalAssessments", totalAssessments);
            
            // Estatísticas por risco de infecção
            Map<WoundAssessment.InfectionRiskLevel, Long> infectionRiskStats = new HashMap<>();
            for (WoundAssessment.InfectionRiskLevel risk : WoundAssessment.InfectionRiskLevel.values()) {
                long count = woundAssessmentRepository.findByInfectionRiskLevel(risk).size();
                infectionRiskStats.put(risk, count);
            }
            statistics.put("infectionRiskDistribution", infectionRiskStats);
            
            // Estatísticas por trajetória de cicatrização
            Map<WoundAssessment.HealingTrajectory, Long> healingTrajectoryStats = new HashMap<>();
            for (WoundAssessment.HealingTrajectory trajectory : WoundAssessment.HealingTrajectory.values()) {
                long count = woundAssessmentRepository.findByHealingTrajectory(trajectory).size();
                healingTrajectoryStats.put(trajectory, count);
            }
            statistics.put("healingTrajectoryDistribution", healingTrajectoryStats);
            
            // Estatísticas por tipo de tecido
            Map<WoundAssessment.TissueType, Long> tissueTypeStats = new HashMap<>();
            List<WoundAssessment> allAssessments = woundAssessmentRepository.findAll();
            for (WoundAssessment assessment : allAssessments) {
                tissueTypeStats.merge(assessment.getPrimaryTissueType(), 1L, Long::sum);
            }
            statistics.put("tissueTypeDistribution", tissueTypeStats);
            
            // Estatísticas por nível de umidade
            Map<WoundAssessment.MoistureLevel, Long> moistureLevelStats = new HashMap<>();
            for (WoundAssessment assessment : allAssessments) {
                moistureLevelStats.merge(assessment.getMoistureLevel(), 1L, Long::sum);
            }
            statistics.put("moistureLevelDistribution", moistureLevelStats);
            
            // Estatísticas de necessidades especiais
            long needsAdvancedTherapy = woundAssessmentRepository.findAssessmentsNeedingAdvancedTherapy().size();
            long needsSpecialistReferral = woundAssessmentRepository.findAssessmentsNeedingSpecialistReferral().size();
            long needsDebridement = allAssessments.stream()
                .mapToLong(a -> a.getNeedsDebridement() ? 1 : 0)
                .sum();
            
            statistics.put("needsAdvancedTherapy", needsAdvancedTherapy);
            statistics.put("needsSpecialistReferral", needsSpecialistReferral);
            statistics.put("needsDebridement", needsDebridement);
            
            // Estatísticas por período (últimos 30 dias)
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            long newAssessmentsLast30Days = woundAssessmentRepository.countAssessmentsByDateRange(thirtyDaysAgo, LocalDateTime.now());
            statistics.put("newAssessmentsLast30Days", newAssessmentsLast30Days);
            
            // Estatísticas de confiança da IA
            List<WoundAssessment> assessmentsWithAI = allAssessments.stream()
                .filter(a -> a.getAiConfidenceScore() != null)
                .collect(Collectors.toList());
            
            if (!assessmentsWithAI.isEmpty()) {
                double avgAIConfidence = assessmentsWithAI.stream()
                    .mapToDouble(WoundAssessment::getAiConfidenceScore)
                    .average()
                    .orElse(0.0);
                statistics.put("averageAIConfidence", avgAIConfidence);
                statistics.put("assessmentsWithAI", assessmentsWithAI.size());
            }
            
            return statistics;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao obter estatísticas: " + e.getMessage(), e);
        }
    }
    
    /**
     * Validar dados da avaliação
     */
    private void validateAssessment(WoundAssessment assessment) {
        if (assessment.getWoundLocation() == null || assessment.getWoundLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Localização da ferida é obrigatória");
        }
        
        if (assessment.getPrimaryTissueType() == null) {
            throw new IllegalArgumentException("Tipo de tecido primário é obrigatório");
        }
        
        if (assessment.getInfectionRiskLevel() == null) {
            throw new IllegalArgumentException("Nível de risco de infecção é obrigatório");
        }
        
        if (assessment.getMoistureLevel() == null) {
            throw new IllegalArgumentException("Nível de umidade é obrigatório");
        }
        
        if (assessment.getHealingTrajectory() == null) {
            throw new IllegalArgumentException("Trajetória de cicatrização é obrigatória");
        }
        
        // Validar percentuais de tecido (soma deve ser <= 100%)
        double totalPercentage = (assessment.getGranulationPercentage() != null ? assessment.getGranulationPercentage() : 0) +
                                (assessment.getSloughPercentage() != null ? assessment.getSloughPercentage() : 0) +
                                (assessment.getNecrosisPercentage() != null ? assessment.getNecrosisPercentage() : 0) +
                                (assessment.getEpithelialPercentage() != null ? assessment.getEpithelialPercentage() : 0);
        
        if (totalPercentage > 100.0) {
            throw new IllegalArgumentException("Soma dos percentuais de tecido não pode exceder 100%");
        }
    }
    
    /**
     * Calcular métricas derivadas
     */
    private void calculateDerivedMetrics(WoundAssessment assessment) {
        // Calcular taxa de contração se houver dados históricos
        if (assessment.getWoundArea() != null && assessment.getWoundPerimeter() != null) {
            // Em uma implementação real, comparar com avaliações anteriores
            // Para simulação, definir um valor baseado na área
            double baseContractionRate = Math.max(0, 0.05 - (assessment.getWoundArea() / 1000.0));
            assessment.setContractionRate(baseContractionRate);
        }
        
        // Determinar se as bordas estão avançando baseado na trajetória
        if (assessment.getHealingTrajectory() == WoundAssessment.HealingTrajectory.IMPROVING) {
            assessment.setEdgesAdvancing(true);
            assessment.setEdgesStagnant(false);
        } else if (assessment.getHealingTrajectory() == WoundAssessment.HealingTrajectory.STAGNANT) {
            assessment.setEdgesAdvancing(false);
            assessment.setEdgesStagnant(true);
        }
        
        // Estimar dias de cicatrização baseado em múltiplos fatores
        if (assessment.getEstimatedHealingDays() == null) {
            int estimatedDays = 30; // Base
            
            // Ajustar baseado no risco de infecção
            if (assessment.getInfectionRiskLevel() == WoundAssessment.InfectionRiskLevel.HIGH) {
                estimatedDays += 30;
            } else if (assessment.getInfectionRiskLevel() == WoundAssessment.InfectionRiskLevel.MEDIUM) {
                estimatedDays += 15;
            }
            
            // Ajustar baseado na trajetória
            if (assessment.getHealingTrajectory() == WoundAssessment.HealingTrajectory.DECLINING) {
                estimatedDays += 45;
            } else if (assessment.getHealingTrajectory() == WoundAssessment.HealingTrajectory.STAGNANT) {
                estimatedDays += 30;
            }
            
            // Ajustar baseado em fatores sociais
            if (assessment.getHasTransportationIssues() || assessment.getHasFinancialBarriers()) {
                estimatedDays += 15;
            }
            
            assessment.setEstimatedHealingDays(estimatedDays);
        }
    }
}
