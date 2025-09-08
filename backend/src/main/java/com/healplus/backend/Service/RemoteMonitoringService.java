package com.healplus.backend.Service;

import com.healplus.backend.Controller.RemoteMonitoringController.*;
import com.healplus.backend.Model.Patient;
import com.healplus.backend.Model.RemoteCheckIn;
import com.healplus.backend.Repository.PatientRepository;
import com.healplus.backend.Repository.RemoteCheckInRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RemoteMonitoringService {

    private final RemoteCheckInRepository checkInRepository;
    private final PatientRepository patientRepository;
    private final AIService aiService;
    private final ImageProcessingService imageProcessingService;

    public DashboardResponse getDashboard(String patientEmail) {
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Calculate streak
        int streak = calculateStreak(patient);

        // Get weekly progress
        WeeklyProgress weeklyProgress = getWeeklyProgress(patient);

        // Get recent activity
        List<ActivityItem> recentActivity = getRecentActivity(patient);

        // Get alerts
        List<AlertResponse> alerts = getAlerts(patient);

        return DashboardResponse.builder()
                .streak(streak)
                .weeklyProgress(weeklyProgress)
                .recentActivity(recentActivity)
                .alerts(alerts)
                .build();
    }

    public RemoteCheckInResponse processPhotoCheckIn(String patientEmail, MultipartFile image, String notes) {
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        try {
            // Save image
            String imagePath = saveImage(image, patient.getId());

            // Process image with AI
            String aiAnalysis = processImageWithAI(image);

            // Create check-in record
            RemoteCheckIn checkIn = new RemoteCheckIn();
            checkIn.setPatient(patient);
            checkIn.setType(RemoteCheckIn.CheckInType.PHOTO);
            checkIn.setNotes(notes);
            checkIn.setImagePath(imagePath);
            checkIn.setImageAnalysis(aiAnalysis);
            checkIn.setCheckinTime(LocalDateTime.now());
            checkIn.setStatus(RemoteCheckIn.CheckInStatus.PENDING);

            // Analyze risk
            analyzeRisk(checkIn);

            checkIn = checkInRepository.save(checkIn);

            return createResponse(checkIn);

        } catch (Exception e) {
            throw new RuntimeException("Error processing photo check-in", e);
        }
    }

    public RemoteCheckInResponse processSymptomCheckIn(String patientEmail, SymptomCheckInRequest request) {
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        RemoteCheckIn checkIn = new RemoteCheckIn();
        checkIn.setPatient(patient);
        checkIn.setType(RemoteCheckIn.CheckInType.SYMPTOMS);
        checkIn.setNotes(request.notes);
        checkIn.setAppearanceRating(request.appearance);
        checkIn.setSymptoms(request.symptoms);
        checkIn.setPainLevel(request.painLevel);
        checkIn.setCheckinTime(LocalDateTime.now());
        checkIn.setStatus(RemoteCheckIn.CheckInStatus.PENDING);

        // Analyze risk based on symptoms
        analyzeSymptomRisk(checkIn);

        checkIn = checkInRepository.save(checkIn);

        return createResponse(checkIn);
    }

    public RemoteCheckInResponse processMedicationCheckIn(String patientEmail, MedicationCheckInRequest request) {
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        RemoteCheckIn checkIn = new RemoteCheckIn();
        checkIn.setPatient(patient);
        checkIn.setType(RemoteCheckIn.CheckInType.MEDICATION);
        checkIn.setMedications(request.medications);
        checkIn.setMedicationNotes(request.notes);
        checkIn.setCheckinTime(LocalDateTime.now());
        checkIn.setStatus(RemoteCheckIn.CheckInStatus.PENDING);

        // Analyze medication adherence
        analyzeMedicationRisk(checkIn);

        checkIn = checkInRepository.save(checkIn);

        return createResponse(checkIn);
    }

    public List<RemoteCheckInResponse> getCheckInHistory(String patientEmail, int days) {
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<RemoteCheckIn> checkIns = checkInRepository.findRecentCheckIns(patient, since);

        return checkIns.stream()
                .map(this::createResponse)
                .collect(Collectors.toList());
    }

    public List<AlertResponse> getAlerts(String patientEmail) {
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<AlertResponse> alerts = new ArrayList<>();

        // Check for high-risk check-ins
        List<RemoteCheckIn> highRiskCheckIns = checkInRepository.findHighRiskCheckIns(
                patient, LocalDateTime.now().minusDays(7));

        for (RemoteCheckIn checkIn : highRiskCheckIns) {
            alerts.add(AlertResponse.builder()
                    .id(checkIn.getId())
                    .type("warning")
                    .title("Alto Risco Detectado")
                    .message("Sua última avaliação indicou alto risco. Consulte seu médico.")
                    .time(formatTimeAgo(checkIn.getCheckinTime()))
                    .action("Marcar como lido")
                    .dismissed(false)
                    .build());
        }

        // Check for missed check-ins
        if (hasMissedCheckIn(patient)) {
            alerts.add(AlertResponse.builder()
                    .id(-1L)
                    .type("info")
                    .title("Check-in Pendente")
                    .message("Você não fez check-in hoje. Que tal atualizar seu progresso?")
                    .time("Há algumas horas")
                    .action("Fazer check-in")
                    .dismissed(false)
                    .build());
        }

        // Check for medication reminders
        if (isMedicationTime()) {
            alerts.add(AlertResponse.builder()
                    .id(-2L)
                    .type("warning")
                    .title("Lembrete de Medicação")
                    .message("Hora de tomar sua medicação!")
                    .time("Agora")
                    .action("Marcar como lido")
                    .dismissed(false)
                    .build());
        }

        return alerts;
    }

    public void dismissAlert(Long alertId, String patientEmail) {
        if (alertId > 0) {
            // For real alerts, mark as reviewed
            RemoteCheckIn checkIn = checkInRepository.findById(alertId)
                    .orElseThrow(() -> new RuntimeException("Check-in not found"));
            
            checkIn.setStatus(RemoteCheckIn.CheckInStatus.REVIEWED);
            checkIn.setReviewedAt(LocalDateTime.now());
            checkInRepository.save(checkIn);
        }
        // For system alerts (negative IDs), just dismiss (no persistence needed)
    }

    public ProgressResponse getProgress(String patientEmail, String period) {
        Patient patient = patientRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        LocalDateTime start = getPeriodStart(period);
        LocalDateTime end = LocalDateTime.now();

        List<RemoteCheckIn> checkIns = checkInRepository.findCheckInsInDateRange(patient, start, end);

        List<ProgressDataPoint> dataPoints = createProgressDataPoints(checkIns, period);
        String trend = calculateTrend(checkIns);
        String recommendation = generateRecommendation(checkIns, trend);

        return ProgressResponse.builder()
                .period(period)
                .data(dataPoints)
                .trend(trend)
                .recommendation(recommendation)
                .build();
    }

    // Helper methods
    private int calculateStreak(Patient patient) {
        LocalDateTime now = LocalDateTime.now();
        int streak = 0;
        
        for (int i = 0; i < 30; i++) {
            LocalDateTime dayStart = now.minusDays(i).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime dayEnd = dayStart.plusDays(1);
            
            List<RemoteCheckIn> dayCheckIns = checkInRepository.findCheckInsInDateRange(patient, dayStart, dayEnd);
            
            if (dayCheckIns.isEmpty()) {
                break;
            }
            streak++;
        }
        
        return streak;
    }

    private WeeklyProgress getWeeklyProgress(Patient patient) {
        LocalDateTime weekStart = LocalDateTime.now().minusWeeks(1);
        
        long photoCount = checkInRepository.countCheckInsByTypeSince(
                patient, RemoteCheckIn.CheckInType.PHOTO, weekStart);
        long symptomCount = checkInRepository.countCheckInsByTypeSince(
                patient, RemoteCheckIn.CheckInType.SYMPTOMS, weekStart);
        long medicationCount = checkInRepository.countCheckInsByTypeSince(
                patient, RemoteCheckIn.CheckInType.MEDICATION, weekStart);

        return WeeklyProgress.builder()
                .photos(ProgressItem.builder().completed((int) photoCount).total(7).build())
                .checkIns(ProgressItem.builder().completed((int) symptomCount).total(7).build())
                .medications(ProgressItem.builder().completed((int) medicationCount).total(7).build())
                .build();
    }

    private List<ActivityItem> getRecentActivity(Patient patient) {
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        List<RemoteCheckIn> checkIns = checkInRepository.findRecentCheckIns(patient, since);

        return checkIns.stream()
                .limit(10)
                .map(this::createActivityItem)
                .collect(Collectors.toList());
    }

    private ActivityItem createActivityItem(RemoteCheckIn checkIn) {
        String type = checkIn.getType().name().toLowerCase();
        String title = getActivityTitle(checkIn.getType());
        String time = formatTimeAgo(checkIn.getCheckinTime());
        String status = checkIn.getStatus().name().toLowerCase();
        String message = getActivityMessage(checkIn);

        return ActivityItem.builder()
                .type(type)
                .title(title)
                .time(time)
                .status(status)
                .message(message)
                .build();
    }

    private String getActivityTitle(RemoteCheckIn.CheckInType type) {
        switch (type) {
            case PHOTO: return "Foto enviada";
            case SYMPTOMS: return "Check-in de sintomas";
            case MEDICATION: return "Medicação registrada";
            case PAIN_ASSESSMENT: return "Avaliação de dor";
            default: return "Check-in realizado";
        }
    }

    private String getActivityMessage(RemoteCheckIn checkIn) {
        if (checkIn.getRiskLevel() == RemoteCheckIn.RiskLevel.HIGH) {
            return "Alto risco detectado";
        } else if (checkIn.getRiskLevel() == RemoteCheckIn.RiskLevel.CRITICAL) {
            return "Risco crítico";
        } else {
            return "Análise concluída";
        }
    }

    private String formatTimeAgo(LocalDateTime time) {
        long hours = ChronoUnit.HOURS.between(time, LocalDateTime.now());
        
        if (hours < 1) {
            return "Agora";
        } else if (hours < 24) {
            return "Há " + hours + " horas";
        } else {
            long days = hours / 24;
            return "Há " + days + " dias";
        }
    }

    private boolean hasMissedCheckIn(Patient patient) {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        List<RemoteCheckIn> todayCheckIns = checkInRepository.findCheckInsInDateRange(
                patient, today, LocalDateTime.now());
        return todayCheckIns.isEmpty();
    }

    private boolean isMedicationTime() {
        int hour = LocalDateTime.now().getHour();
        return hour == 8 || hour == 14 || hour == 20;
    }

    private String saveImage(MultipartFile image, Long patientId) {
        // Implementation would save the image to storage
        // For now, return a mock path
        return "/images/patient_" + patientId + "/" + System.currentTimeMillis() + ".jpg";
    }

    private String processImageWithAI(MultipartFile image) {
        // Use AI service to analyze the image
        // For now, return mock analysis
        return "{\"tissue_analysis\": {\"granulation\": 45, \"slough\": 30, \"necrosis\": 25}, \"risk_score\": 0.3}";
    }

    private void analyzeRisk(RemoteCheckIn checkIn) {
        // Analyze risk based on image analysis and other factors
        double riskScore = Math.random() * 0.8 + 0.1; // Mock risk score
        checkIn.setRiskScore(riskScore);
        
        if (riskScore > 0.7) {
            checkIn.setRiskLevel(RemoteCheckIn.RiskLevel.HIGH);
        } else if (riskScore > 0.4) {
            checkIn.setRiskLevel(RemoteCheckIn.RiskLevel.MEDIUM);
        } else {
            checkIn.setRiskLevel(RemoteCheckIn.RiskLevel.LOW);
        }
    }

    private void analyzeSymptomRisk(RemoteCheckIn checkIn) {
        double riskScore = 0.2; // Base risk
        
        // Increase risk based on symptoms
        if (checkIn.getSymptoms() != null) {
            for (String symptom : checkIn.getSymptoms()) {
                switch (symptom) {
                    case "fever": riskScore += 0.3; break;
                    case "redness": riskScore += 0.2; break;
                    case "swelling": riskScore += 0.2; break;
                    case "discharge": riskScore += 0.25; break;
                    case "odor": riskScore += 0.2; break;
                }
            }
        }
        
        // Increase risk based on pain level
        if (checkIn.getPainLevel() != null && checkIn.getPainLevel() > 6) {
            riskScore += 0.2;
        }
        
        checkIn.setRiskScore(Math.min(riskScore, 1.0));
        
        if (riskScore > 0.7) {
            checkIn.setRiskLevel(RemoteCheckIn.RiskLevel.HIGH);
        } else if (riskScore > 0.4) {
            checkIn.setRiskLevel(RemoteCheckIn.RiskLevel.MEDIUM);
        } else {
            checkIn.setRiskLevel(RemoteCheckIn.RiskLevel.LOW);
        }
    }

    private void analyzeMedicationRisk(RemoteCheckIn checkIn) {
        // Analyze medication adherence
        double riskScore = 0.1; // Base risk for medication check-in
        
        // Check if all medications were taken
        if (checkIn.getMedications() != null && checkIn.getMedications().size() < 3) {
            riskScore += 0.3; // Higher risk if not all medications taken
        }
        
        checkIn.setRiskScore(riskScore);
        checkIn.setRiskLevel(riskScore > 0.5 ? RemoteCheckIn.RiskLevel.MEDIUM : RemoteCheckIn.RiskLevel.LOW);
    }

    private RemoteCheckInResponse createResponse(RemoteCheckIn checkIn) {
        return RemoteCheckInResponse.builder()
                .id(checkIn.getId())
                .type(checkIn.getType().name())
                .notes(checkIn.getNotes())
                .riskLevel(checkIn.getRiskLevel().name())
                .riskScore(checkIn.getRiskScore())
                .timestamp(checkIn.getCheckinTime().toString())
                .status(checkIn.getStatus().name())
                .build();
    }

    private LocalDateTime getPeriodStart(String period) {
        switch (period.toLowerCase()) {
            case "week": return LocalDateTime.now().minusWeeks(1);
            case "month": return LocalDateTime.now().minusMonths(1);
            case "quarter": return LocalDateTime.now().minusMonths(3);
            default: return LocalDateTime.now().minusWeeks(1);
        }
    }

    private List<ProgressDataPoint> createProgressDataPoints(List<RemoteCheckIn> checkIns, String period) {
        // Create mock progress data points
        List<ProgressDataPoint> dataPoints = new ArrayList<>();
        
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            double value = Math.random() * 100;
            
            dataPoints.add(ProgressDataPoint.builder()
                    .date(date.toLocalDate().toString())
                    .value(value)
                    .label("Dia " + (7 - i))
                    .build());
        }
        
        return dataPoints;
    }

    private String calculateTrend(List<RemoteCheckIn> checkIns) {
        // Simple trend calculation based on risk scores
        if (checkIns.size() < 2) return "stable";
        
        double recentRisk = checkIns.stream()
                .limit(3)
                .mapToDouble(c -> c.getRiskScore() != null ? c.getRiskScore() : 0)
                .average()
                .orElse(0);
        
        double olderRisk = checkIns.stream()
                .skip(3)
                .limit(3)
                .mapToDouble(c -> c.getRiskScore() != null ? c.getRiskScore() : 0)
                .average()
                .orElse(0);
        
        if (recentRisk > olderRisk + 0.1) return "worsening";
        if (recentRisk < olderRisk - 0.1) return "improving";
        return "stable";
    }

    private String generateRecommendation(List<RemoteCheckIn> checkIns, String trend) {
        switch (trend) {
            case "improving":
                return "Continue com o tratamento atual. O progresso está positivo!";
            case "worsening":
                return "Consulte seu médico. Pode ser necessário ajustar o tratamento.";
            default:
                return "Mantenha a consistência nos cuidados. O progresso está estável.";
        }
    }

    // Response DTOs
    public static class RemoteCheckInResponse {
        public Long id;
        public String type;
        public String notes;
        public String riskLevel;
        public Double riskScore;
        public String timestamp;
        public String status;

        public static RemoteCheckInResponseBuilder builder() {
            return new RemoteCheckInResponseBuilder();
        }

        public static class RemoteCheckInResponseBuilder {
            private Long id;
            private String type;
            private String notes;
            private String riskLevel;
            private Double riskScore;
            private String timestamp;
            private String status;

            public RemoteCheckInResponseBuilder id(Long id) {
                this.id = id;
                return this;
            }

            public RemoteCheckInResponseBuilder type(String type) {
                this.type = type;
                return this;
            }

            public RemoteCheckInResponseBuilder notes(String notes) {
                this.notes = notes;
                return this;
            }

            public RemoteCheckInResponseBuilder riskLevel(String riskLevel) {
                this.riskLevel = riskLevel;
                return this;
            }

            public RemoteCheckInResponseBuilder riskScore(Double riskScore) {
                this.riskScore = riskScore;
                return this;
            }

            public RemoteCheckInResponseBuilder timestamp(String timestamp) {
                this.timestamp = timestamp;
                return this;
            }

            public RemoteCheckInResponseBuilder status(String status) {
                this.status = status;
                return this;
            }

            public RemoteCheckInResponse build() {
                RemoteCheckInResponse response = new RemoteCheckInResponse();
                response.id = this.id;
                response.type = this.type;
                response.notes = this.notes;
                response.riskLevel = this.riskLevel;
                response.riskScore = this.riskScore;
                response.timestamp = this.timestamp;
                response.status = this.status;
                return response;
            }
        }
    }
}
