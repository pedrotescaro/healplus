package com.healplus.backend.Controller.Auth;

import com.healplus.backend.Model.DTO.AuthRequest;
import com.healplus.backend.Model.DTO.AuthResponse;
import com.healplus.backend.Model.DTO.RegisterRequest;
import com.healplus.backend.Model.DTO.UserResponse;
import com.healplus.backend.Model.Entity.User;
import com.healplus.backend.Service.Auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody String refreshToken) {
        return ResponseEntity.ok(authService.refresh(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(Authentication authentication) {
        authService.logout(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(UserResponse.fromUser(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UserResponse request,
            Authentication authentication
    ) {
        User user = authService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(UserResponse.fromUser(user));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    // LGPD Compliance endpoints
    @PostMapping("/consent")
    public ResponseEntity<Void> updateConsent(
            @RequestBody ConsentRequest request,
            Authentication authentication
    ) {
        authService.updateConsent(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/data-export")
    public ResponseEntity<DataExportResponse> exportUserData(Authentication authentication) {
        DataExportResponse data = authService.exportUserData(authentication.getName());
        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(
            @RequestBody DeleteAccountRequest request,
            Authentication authentication
    ) {
        authService.deleteAccount(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    // DTOs
    public static class ChangePasswordRequest {
        public String currentPassword;
        public String newPassword;
    }

    public static class ForgotPasswordRequest {
        public String email;
    }

    public static class ResetPasswordRequest {
        public String token;
        public String newPassword;
    }

    public static class ConsentRequest {
        public Boolean dataProcessingConsent;
        public Boolean marketingConsent;
        public Boolean analyticsConsent;
        public String consentVersion;
    }

    public static class DataExportResponse {
        public UserResponse user;
        public Object assessments;
        public Object appointments;
        public Object chatHistory;
        public LocalDateTime exportedAt;
    }

    public static class DeleteAccountRequest {
        public String password;
        public String reason;
        public Boolean confirmDeletion;
    }
}
