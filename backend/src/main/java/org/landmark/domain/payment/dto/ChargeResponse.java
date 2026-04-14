package org.landmark.domain.payment.dto;

public record ChargeResponse(
        String paymentId,
        String orderId,
        Long amount,
        String bankName,
        String accountNumber,
        String expiredAt
) {}
