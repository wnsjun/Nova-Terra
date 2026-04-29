package org.landmark.domain.payment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.payment.dto.ChargeRequest;
import org.landmark.domain.payment.dto.ChargeResponse;
import org.landmark.domain.payment.service.UserPaymentService;
import org.landmark.domain.rental.service.RentalIncomeService;
import org.landmark.global.dto.ApiResponse;
import org.landmark.global.toss.client.TossPaymentsClient;
import org.landmark.global.toss.dto.TossDepositCallbackRequest;
import org.landmark.global.toss.dto.TossPaymentInquiryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "User Payment", description = "사용자 KRWT 충전 + 토스 webhook 통합 처리")
public class UserPaymentController {

    private static final String RENTAL_ORDER_ID_PREFIX = "RENTAL_";

    private final UserPaymentService userPaymentService;
    private final RentalIncomeService rentalIncomeService;
    private final TossPaymentsClient tossPaymentsClient;

    @Operation(summary = "KRWT 충전 요청 (가상계좌 발급)")
    @PostMapping("/charge")
    public ApiResponse<ChargeResponse> charge(@AuthenticationPrincipal Jwt jwt,
                                              @Valid @RequestBody ChargeRequest request) {
        String userId = jwt.getSubject();
        ChargeResponse response = userPaymentService.charge(userId, request);
        return ApiResponse.created("충전 요청 생성 완료", response);
    }

    @Operation(summary = "토스페이먼츠 가상계좌 입금 webhook (DEPOSIT_CALLBACK 통합)",
            description = "토스 docs 기준 flat 형식. orderId prefix로 분기: RENTAL_* → 임대 수익, 그 외 → 사용자 KRWT 충전. " +
                    "DEPOSIT_CALLBACK엔 amount/paymentKey가 없어 결제 조회 API로 별도 조회 후 처리.")
    @PostMapping("/webhook/toss")
    public ResponseEntity<ApiResponse<Void>> handleTossWebhook(
            @RequestBody TossDepositCallbackRequest request) {
        log.info("토스 webhook 수신 - orderId: {}, status: {}, transactionKey: {}",
                request.orderId(), request.status(), request.transactionKey());

        if (!"DONE".equals(request.status())) {
            log.info("처리 대상 아님 - status: {}", request.status());
            return ResponseEntity.ok(ApiResponse.ok(200, "Webhook 수신 (처리 대상 아님)"));
        }

        TossPaymentInquiryResponse payment = tossPaymentsClient.getPaymentByOrderId(request.orderId());

        if (request.orderId().startsWith(RENTAL_ORDER_ID_PREFIX)) {
            log.info("임대 수익 입금으로 분기 - orderId: {}", request.orderId());
            rentalIncomeService.completeRentalIncome(
                    payment.orderId(),
                    payment.paymentKey(),
                    payment.totalAmount()
            );
        } else {
            log.info("KRWT 충전 입금으로 분기 - orderId: {}", request.orderId());
            userPaymentService.completeCharge(
                    payment.orderId(),
                    payment.paymentKey(),
                    payment.totalAmount()
            );
        }

        return ResponseEntity.ok(ApiResponse.ok(200, "Webhook 처리 완료"));
    }
}
