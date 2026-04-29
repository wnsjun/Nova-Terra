package org.landmark.domain.rental.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.rental.dto.PropertyVirtualAccountResponse;
import org.landmark.domain.rental.dto.RentalIncomeResponse;
import org.landmark.domain.rental.service.RentalIncomeService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/rental")
@RequiredArgsConstructor
@Tag(name = "Rental Income", description = "임대 수익 관리 API")
public class RentalIncomeController {

    private final RentalIncomeService rentalIncomeService;

    @Operation(summary = "임대 수익 가상계좌 발급",
            description = "Property별 임대 수익 가상계좌를 발급합니다. amount는 토스 단건 가상계좌의 입금 예정액(원). 시연용으로 부동산마다 다른 금액 발급 가능.")
    @PostMapping("/properties/{propertyId}/virtual-accounts")
    public ApiResponse<PropertyVirtualAccountResponse> issueVirtualAccount(
            @PathVariable String propertyId,
            @RequestParam Long amount) {
        log.info("임대 수익 가상계좌 발급 요청 - propertyId: {}, amount: {}", propertyId, amount);
        PropertyVirtualAccountResponse response = rentalIncomeService.issueVirtualAccountForProperty(propertyId, amount);
        return ApiResponse.ok(200, "가상계좌 발급 성공", response);
    }

    @Operation(summary = "임대 수익 가상계좌 조회", description = "Property별 임대 수익 가상계좌 정보를 조회합니다.")
    @GetMapping("/properties/{propertyId}/virtual-accounts")
    public ApiResponse<PropertyVirtualAccountResponse> getVirtualAccount(@PathVariable String propertyId) {
        log.info("임대 수익 가상계좌 조회 요청 - propertyId: {}", propertyId);
        PropertyVirtualAccountResponse response = rentalIncomeService.getVirtualAccountByProperty(propertyId);
        return ApiResponse.ok(200, "가상계좌 조회 성공", response);
    }

    @Operation(summary = "임대 수익 내역 조회", description = "Property별 임대 수익 입금 내역을 조회합니다.")
    @GetMapping("/properties/{propertyId}/rental-incomes")
    public ApiResponse<List<RentalIncomeResponse>> getRentalIncomes(@PathVariable String propertyId) {
        log.info("임대 수익 내역 조회 요청 - propertyId: {}", propertyId);
        List<RentalIncomeResponse> responses = rentalIncomeService.getRentalIncomesByProperty(propertyId);
        return ApiResponse.ok(200, "임대 수익 내역 조회 성공", responses);
    }
}
