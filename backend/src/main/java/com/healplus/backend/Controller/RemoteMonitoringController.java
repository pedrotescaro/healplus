package com.healplus.backend.Controller;

import com.healplus.backend.DTO.RemoteCheckInRequest;
import com.healplus.backend.DTO.RemoteCheckInResponse;
import com.healplus.backend.Model.Patient;
import com.healplus.backend.Model.RemoteCheckIn;
import com.healplus.backend.Service.RemoteMonitoringService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RemoteMonitoringController {

    private final RemoteMonitoringService remoteMonitoringService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        String patientEmail = authentication.getName();
        DashboardResponse dashboard = remoteMonitoringService.getDashboard(patientEmail);
        return ResponseEntity.ok(dashboard);
    }

    @PostMapping("/photo-checkin")
    public ResponseEntity<RemoteCheckInResponse> submitPhotoCheckIn(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "notes", required = false) String notes,
            Authentication authentication
    ) {
        String patientEmail = authentication.getName();
        RemoteCheckInResponse response = remoteMonitoringService.processPhotoCheckIn(
                patientEmail, image, notes
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/symptom-checkin")
    public ResponseEntity<RemoteCheckInResponse> submitSymptomCheckIn(
            @Valid @RequestBody SymptomCheckInRequest request,
            Authentication authentication
    ) {
        String patientEmail = authentication.getName();
        RemoteCheckInResponse response = remoteMonitoringService.processSymptomCheckIn(
                patientEmail, request
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/medication-checkin")
    public ResponseEntity<RemoteCheckInResponse> submitMedicationCheckIn(
            @Valid @RequestBody MedicationCheckInRequest request,
            Authentication authentication
    ) {
        String patientEmail = authentication.getName();
        RemoteCheckInResponse response = remoteMonitoringService.processMedicationCheckIn(
                patientEmail, request
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/checkins")
    public ResponseEntity<List<RemoteCheckInResponse>> getCheckInHistory(
            @RequestParam(value = "days", defaultValue = "7") int days,
            Authentication authentication
    ) {
        String patientEmail = authentication.getName();
        List<RemoteCheckInResponse> checkIns = remoteMonitoringService.getCheckInHistory(
                patientEmail, days
        );
        return ResponseEntity.ok(checkIns);
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<AlertResponse>> getAlerts(Authentication authentication) {
        String patientEmail = authentication.getName();
        List<AlertResponse> alerts = remoteMonitoringService.getAlerts(patientEmail);
        return ResponseEntity.ok(alerts);
    }

    @PostMapping("/alerts/{alertId}/dismiss")
    public ResponseEntity<Void> dismissAlert(
            @PathVariable UUID alertId,
            Authentication authentication
    ) {
        String patientEmail = authentication.getName();
        remoteMonitoringService.dismissAlert(alertId, patientEmail);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/progress")
    public ResponseEntity<ProgressResponse> getProgress(
            @RequestParam(value = "period", defaultValue = "week") String period,
            Authentication authentication
    ) {
        String patientEmail = authentication.getName();
        ProgressResponse progress = remoteMonitoringService.getProgress(patientEmail, period);
        return ResponseEntity.ok(progress);
    }

    // DTOs
    public static class SymptomCheckInRequest {
        public String appearance;
        public List<String> symptoms;
        public Integer painLevel;
        public String notes;
    }

    public static class MedicationCheckInRequest {
        public List<String> medications;
        public String notes;
    }

    public static class DashboardResponse {
        public int streak;
        public WeeklyProgress weeklyProgress;
        public List<ActivityItem> recentActivity;
        public List<AlertResponse> alerts;
    }

    public static class WeeklyProgress {
        public ProgressItem photos;
        public ProgressItem checkIns;
        public ProgressItem medications;
    }

    public static class ProgressItem {
        public int completed;
        public int total;
    }

    public static class ActivityItem {
        public String type;
        public String title;
        public String time;
        public String status;
        public String message;
    }

    public static class AlertResponse {
        public UUID id;
        public String type;
        public String title;
        public String message;
        public String time;
        public String action;
        public boolean dismissed;
    }

    public static class ProgressResponse {
        public String period;
        public List<ProgressDataPoint> data;
        public String trend;
        public String recommendation;
    }

    public static class ProgressDataPoint {
        public String date;
        public double value;
        public String label;
    }
}
