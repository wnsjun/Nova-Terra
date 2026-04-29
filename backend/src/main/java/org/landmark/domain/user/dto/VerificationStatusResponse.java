package org.landmark.domain.user.dto;

import org.landmark.domain.user.domain.User;

public record VerificationStatusResponse(
        boolean kycVerified,
        boolean creditCheckCompleted
) {
    public static VerificationStatusResponse from(User user) {
        return new VerificationStatusResponse(
                user.isKycVerified(),
                user.isCreditCheckCompleted()
        );
    }
}
