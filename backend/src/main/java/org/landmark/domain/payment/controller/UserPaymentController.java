package org.landmark.domain.payment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.payment.dto.ChargeRequest;
import org.landmark.domain.payment.dto.ChargeResponse;
import org.landmark.domain.payment.service.UserPaymentService;
import org.landmark.global.dto.ApiResponse;
import org.landmark.global.toss.dto.TossWebhookRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "User Payment", description = "사용자 KRWT 충전 API")
public class UserPaymentController {

    private final UserPaymentService userPaymentService;

    @Operation(summary = "KRWT 충전 요청 (가상계좌 발급)")
    @PostMapping("/charge")
    public ApiResponse<ChargeResponse> charge(@AuthenticationPrincipal Jwt jwt,
                                              @Valid @RequestBody ChargeRequest request) {
        String userId = jwt.getSubject();
        ChargeResponse response = userPaymentService.charge(userId, request);
        return ApiResponse.created("충전 요청 생성 완료", response);
    }

    @Operation(summary = "토스페이먼츠 DEPOSIT_CALLBACK webhook")
    @PostMapping("/webhook/toss")
    public ResponseEntity<ApiResponse<Void>> handleTossWebhook(@RequestBody TossWebhookRequest request) {
        log.info("토스 충전 webhook 수신 - eventType: {}, orderId: {}",
                request.eventType(), request.data().orderId());

        if (!"DONE".equals(request.data().status())) {
            return ResponseEntity.ok(ApiResponse.ok(200, "처리 대상 아님"));
        }

        userPaymentService.completeCharge(
                request.data().orderId(),
                request.data().paymentKey(),
                request.data().totalAmount()
        );
        return ResponseEntity.ok(ApiResponse.ok(200, "Webhook 처리 완료"));
    }
}
