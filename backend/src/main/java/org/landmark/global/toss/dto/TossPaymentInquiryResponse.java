package org.landmark.global.toss.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 토스페이먼츠 결제 조회(GET /v1/payments/orders/{orderId}) 응답 — webhook에서 빠진 paymentKey/totalAmount를 끌어오기 위함.
 * 토스 응답에는 다른 필드도 많지만 우리가 쓰는 것만 매핑.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record TossPaymentInquiryResponse(
        String paymentKey,
        String orderId,
        Long totalAmount,
        String status
) {
}
