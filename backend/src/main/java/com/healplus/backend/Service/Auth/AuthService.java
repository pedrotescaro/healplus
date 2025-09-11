package com.healplus.backend.Service.Auth;

import com.healplus.backend.Model.DTO.AuthRequest;
import com.healplus.backend.Model.DTO.AuthResponse;
import com.healplus.backend.Model.DTO.RegisterRequest;
import com.healplus.backend.Model.DTO.UserResponse;
import com.healplus.backend.Model.Entity.User;
import com.healplus.backend.Repository.Auth.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                      JwtService jwtService, AuthenticationManager authenticationManager, 
                      EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        // Validate unique email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email já está em uso");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());
        user.setIsActive(true);
        user.setEmailVerified(false);
        user.setDataProcessingConsent(request.getDataProcessingConsent());
        user.setMarketingConsent(request.getMarketingConsent());
        user.setAnalyticsConsent(request.getAnalyticsConsent());
        user.setConsentVersion("1.0");
        user.setConsentGivenAt(LocalDateTime.now());
        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        // Send email verification
        sendEmailVerification(user);

        // Generate tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(UserResponse.fromUser(user));
        return response;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = (User) authentication.getPrincipal();
        
        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Conta desativada");
        }

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(UserResponse.fromUser(user));
        return response;
    }

    public AuthResponse refresh(String refreshToken) {
        if (!jwtService.isTokenValid(refreshToken)) {
            throw new IllegalArgumentException("Token de refresh inválido");
        }

        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Conta desativada");
        }

        // Generate new tokens
        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(newRefreshToken);
        response.setUser(UserResponse.fromUser(user));
        return response;
    }

    public void logout(String email) {
        // In a real implementation, you would blacklist the token
        // For now, we'll just log the logout
        System.out.println("User " + email + " logged out");
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }

    public User updateProfile(String email, UserResponse request) {
        User user = getCurrentUser(email);
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhone());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = getCurrentUser(email);
        
        if (!passwordEncoder.matches(request.currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpires(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Send reset email
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido"));

        if (user.getPasswordResetExpires().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expirado");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpires(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // LGPD Compliance methods
    public void updateConsent(String email, ConsentRequest request) {
        User user = getCurrentUser(email);
        
        user.setDataProcessingConsent(request.dataProcessingConsent);
        user.setMarketingConsent(request.marketingConsent);
        user.setAnalyticsConsent(request.analyticsConsent);
        user.setConsentVersion(request.consentVersion);
        user.setConsentGivenAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    public DataExportResponse exportUserData(String email) {
        User user = getCurrentUser(email);
        
        // In a real implementation, you would gather all user data
        // For now, we'll return basic user info
        return DataExportResponse.builder()
                .user(UserResponse.fromUser(user))
                .exportedAt(LocalDateTime.now())
                .build();
    }

    public void deleteAccount(String email, DeleteAccountRequest request) {
        if (!request.confirmDeletion) {
            throw new IllegalArgumentException("Confirmação de exclusão necessária");
        }

        User user = getCurrentUser(email);
        
        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new IllegalArgumentException("Senha incorreta");
        }

        // Soft delete - mark as inactive instead of hard delete
        user.setIsActive(false);
        user.setDeletedAt(LocalDateTime.now());
        user.setDeletionReason(request.reason);
        userRepository.save(user);
    }

    private void sendEmailVerification(User user) {
        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationExpires(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendEmailVerification(user.getEmail(), verificationToken);
    }

    // DTOs
    public static class ChangePasswordRequest {
        public String currentPassword;
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

        public static DataExportResponseBuilder builder() {
            return new DataExportResponseBuilder();
        }

        public static class DataExportResponseBuilder {
            private UserResponse user;
            private Object assessments;
            private Object appointments;
            private Object chatHistory;
            private LocalDateTime exportedAt;

            public DataExportResponseBuilder user(UserResponse user) {
                this.user = user;
                return this;
            }

            public DataExportResponseBuilder assessments(Object assessments) {
                this.assessments = assessments;
                return this;
            }

            public DataExportResponseBuilder appointments(Object appointments) {
                this.appointments = appointments;
                return this;
            }

            public DataExportResponseBuilder chatHistory(Object chatHistory) {
                this.chatHistory = chatHistory;
                return this;
            }

            public DataExportResponseBuilder exportedAt(LocalDateTime exportedAt) {
                this.exportedAt = exportedAt;
                return this;
            }

            public DataExportResponse build() {
                DataExportResponse response = new DataExportResponse();
                response.user = this.user;
                response.assessments = this.assessments;
                response.appointments = this.appointments;
                response.chatHistory = this.chatHistory;
                response.exportedAt = this.exportedAt;
                return response;
            }
        }
    }

    public static class DeleteAccountRequest {
        public String password;
        public String reason;
        public Boolean confirmDeletion;
    }
}
