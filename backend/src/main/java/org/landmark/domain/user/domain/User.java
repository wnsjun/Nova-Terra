package org.landmark.domain.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "Users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @Column(name = "id", length = 36, updatable = false, nullable = false)
    private String id;

    @Column(name = "wallet_address", length = 42, unique = true)
    private String walletAddress;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "kyc_verified", nullable = false)
    private boolean kycVerified;

    @Column(name = "credit_check_completed", nullable = false)
    private boolean creditCheckCompleted;

    @Column(name = "created_at", updatable = false)
    private Long createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = System.currentTimeMillis() / 1000L;
    }

    @Builder
    public User(String email, String passwordHash, String name,
                String profileImageUrl, AuthProvider provider, String providerId) {
        this.id = UUID.randomUUID().toString();
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.provider = provider;
        this.providerId = providerId;
    }

    public static User createGoogleUser(String email, String name, String profileImageUrl, String providerId) {
        return User.builder()
                .email(email)
                .name(name)
                .profileImageUrl(profileImageUrl)
                .provider(AuthProvider.GOOGLE)
                .providerId(providerId)
                .build();
    }

    public void updateGoogleInfo(String name, String profileImageUrl) {
        this.name = name;
        this.profileImageUrl = profileImageUrl;
    }

    public void linkWallet(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public void completeVerification() {
        this.kycVerified = true;
        this.creditCheckCompleted = true;
    }
}
