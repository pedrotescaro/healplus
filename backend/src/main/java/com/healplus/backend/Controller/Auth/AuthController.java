package com.healplus.backend.Controller.Auth;

import com.healplus.backend.Model.DTO.AuthRequest;
import com.healplus.backend.Model.DTO.AuthResponse;
import com.healplus.backend.Model.DTO.RegisterRequest;
import com.healplus.backend.Model.DTO.UserResponse;
import com.healplus.backend.Model.Entity.User;
import com.healplus.backend.Service.Auth.AuthService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

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
            @RequestBody AuthService.ChangePasswordRequest request,
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
            @RequestBody AuthService.ConsentRequest request,
            Authentication authentication
    ) {
        authService.updateConsent(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/data-export")
    public ResponseEntity<AuthService.DataExportResponse> exportUserData(Authentication authentication) {
        AuthService.DataExportResponse data = authService.exportUserData(authentication.getName());
        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteAccount(
            @RequestBody AuthService.DeleteAccountRequest request,
            Authentication authentication
    ) {
        authService.deleteAccount(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    // DTOs
    public static class ForgotPasswordRequest {
        public String email;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ResetPasswordRequest {
        public String token;
        public String newPassword;
        
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
