package org.landmark.domain.auth.dto;

import org.landmark.domain.user.domain.AuthProvider;
import org.landmark.domain.user.domain.User;

public record UserInfoResponse(
        String userId,
        String email,
        String name,
        String profileImageUrl,
        AuthProvider provider,
        boolean kycVerified,
        boolean creditCheckCompleted
) {
    public static UserInfoResponse from(User user) {
        return new UserInfoResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getProfileImageUrl(),
                user.getProvider(),
                user.isKycVerified(),
                user.isCreditCheckCompleted()
        );
    }
}
