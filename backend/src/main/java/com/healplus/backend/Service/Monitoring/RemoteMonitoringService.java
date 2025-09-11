package com.healplus.backend.Service.Monitoring;

import com.healplus.backend.Controller.Monitoring.RemoteMonitoringController.*;
import com.healplus.backend.Model.Entity.Patient;
import com.healplus.backend.Model.Entity.RemoteCheckIn;
import com.healplus.backend.Repository.Patient.PatientRepository;
import com.healplus.backend.Repository.Monitoring.RemoteCheckInRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@Transactional
public class RemoteMonitoringService {

    private final RemoteCheckInRepository checkInRepository;
    private final PatientRepository patientRepository;

    public RemoteMonitoringService(RemoteCheckInRepository checkInRepository, 
                                 PatientRepository patientRepository) {
        this.checkInRepository = checkInRepository;
        this.patientRepository = patientRepository;
    }

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
        List<AlertResponse> alerts = getAlerts(patient.getEmail());

        DashboardResponse response = new DashboardResponse();
        response.streak = streak;
        response.weeklyProgress = weeklyProgress;
        response.recentActivity = recentActivity;
        response.alerts = alerts;
        return response;
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
            AlertResponse alert = new AlertResponse();
            alert.id = checkIn.getId();
            alert.type = "warning";
            alert.title = "Alto Risco Detectado";
            alert.message = "Sua última avaliação indicou alto risco. Consulte seu médico.";
            alert.time = formatTimeAgo(checkIn.getCheckinTime());
            alert.action = "Marcar como lido";
            alert.dismissed = false;
            alerts.add(alert);
        }

        // Check for missed check-ins
        if (hasMissedCheckIn(patient)) {
            AlertResponse alert = new AlertResponse();
            alert.id = UUID.randomUUID();
            alert.type = "info";
            alert.title = "Check-in Pendente";
            alert.message = "Você não fez check-in hoje. Que tal atualizar seu progresso?";
            alert.time = "Há algumas horas";
            alert.action = "Fazer check-in";
            alert.dismissed = false;
            alerts.add(alert);
        }

        // Check for medication reminders
        if (isMedicationTime()) {
            AlertResponse alert = new AlertResponse();
            alert.id = UUID.randomUUID();
            alert.type = "warning";
            alert.title = "Lembrete de Medicação";
            alert.message = "Hora de tomar sua medicação!";
            alert.time = "Agora";
            alert.action = "Marcar como lido";
            alert.dismissed = false;
            alerts.add(alert);
        }

        return alerts;
    }

    public void dismissAlert(UUID alertId, String patientEmail) {
        if (alertId != null) {
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

        ProgressResponse response = new ProgressResponse();
        response.period = period;
        response.data = dataPoints;
        response.trend = trend;
        response.recommendation = recommendation;
        return response;
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

        WeeklyProgress progress = new WeeklyProgress();
        
        ProgressItem photos = new ProgressItem();
        photos.completed = (int) photoCount;
        photos.total = 7;
        progress.photos = photos;
        
        ProgressItem checkIns = new ProgressItem();
        checkIns.completed = (int) symptomCount;
        checkIns.total = 7;
        progress.checkIns = checkIns;
        
        ProgressItem medications = new ProgressItem();
        medications.completed = (int) medicationCount;
        medications.total = 7;
        progress.medications = medications;
        
        return progress;
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

        ActivityItem item = new ActivityItem();
        item.type = type;
        item.title = title;
        item.time = time;
        item.status = status;
        item.message = message;
        return item;
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

    private String saveImage(MultipartFile image, UUID patientId) {
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
        RemoteCheckInResponse response = new RemoteCheckInResponse();
        response.id = checkIn.getId();
        response.type = checkIn.getType().name();
        response.notes = checkIn.getNotes();
        response.riskLevel = checkIn.getRiskLevel().name();
        response.riskScore = checkIn.getRiskScore();
        response.timestamp = checkIn.getCheckinTime().toString();
        response.status = checkIn.getStatus().name();
        return response;
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
            
            ProgressDataPoint dataPoint = new ProgressDataPoint();
            dataPoint.date = date.toLocalDate().toString();
            dataPoint.value = value;
            dataPoint.label = "Dia " + (7 - i);
            dataPoints.add(dataPoint);
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
        public UUID id;
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
            private UUID id;
            private String type;
            private String notes;
            private String riskLevel;
            private Double riskScore;
            private String timestamp;
            private String status;

            public RemoteCheckInResponseBuilder id(UUID id) {
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
