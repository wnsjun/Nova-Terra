package org.landmark.global.toss.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 토스페이먼츠 가상계좌 입금 webhook (DEPOSIT_CALLBACK) 페이로드.
 * 토스 docs 기준 flat 형식 — paymentKey/totalAmount 포함되지 않음. 결제 조회 API로 별도 조회 필요.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record TossDepositCallbackRequest(
        String createdAt,
        String secret,
        String status,
        String transactionKey,
        String orderId
) {
}
