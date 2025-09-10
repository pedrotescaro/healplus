package com.healplus.backend.DTO;

import com.healplus.backend.Model.User;
import com.healplus.backend.Model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private UserRole role;
    private Boolean isActive;
    private Boolean emailVerified;
    private Boolean dataProcessingConsent;
    private Boolean marketingConsent;
    private Boolean analyticsConsent;
    private String consentVersion;
    private LocalDateTime consentDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .isActive(user.isActive())
                .emailVerified(user.isEmailVerified())
                .dataProcessingConsent(user.getDataProcessingConsent())
                .marketingConsent(user.getMarketingConsent())
                .analyticsConsent(user.getAnalyticsConsent())
                .consentVersion(user.getConsentVersion())
                .consentDate(user.getConsentDate())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
