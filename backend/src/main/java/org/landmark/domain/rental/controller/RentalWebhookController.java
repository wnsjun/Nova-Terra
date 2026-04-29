package org.landmark.domain.rental.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.rental.service.RentalIncomeService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/rental/webhook")
@RequiredArgsConstructor
@Tag(name = "Rental Webhook", description = "임대 수익 Webhook API")
public class RentalWebhookController {

    private final RentalIncomeService rentalIncomeService;

    @Operation(summary = "[테스트용] 임대 수익 입금 완료 처리",
            description = "개발/테스트 환경에서 임대 수익 입금 완료를 직접 시뮬레이션합니다. " +
                    "운영 webhook은 /api/v1/payments/webhook/toss로 통합되었음.")
    @PostMapping("/complete")
    public ApiResponse<Void> completeRentalIncome(@RequestBody org.landmark.domain.rental.dto.RentalIncomeCompleteRequest request) {
        log.info("임대 수익 입금 완료 시뮬레이션 - accountNumberOrOrderId: {}, amount: {}",
                request.accountNumberOrOrderId(), request.amount());

        String paymentKey = (request.paymentKey() != null && !request.paymentKey().isBlank())
                ? request.paymentKey()
                : "test_payment_key_" + System.currentTimeMillis();

        rentalIncomeService.completeRentalIncome(
                request.accountNumberOrOrderId(),
                paymentKey,
                request.amount()
        );

        return ApiResponse.ok(200, "임대 수익 입금 완료 처리 성공");
    }
}
