package org.landmark.domain.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.landmark.domain.user.dto.VerificationStatusResponse;
import org.landmark.domain.user.dto.WalletLinkRequest;
import org.landmark.domain.user.service.UserService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "사용자 API")
public class UserController {

    private final UserService userService;

    @Operation(summary = "지갑 연동", description = "로그인한 사용자의 블록체인 지갑 주소를 연동합니다.")
    @PatchMapping("/me/wallet")
    public ApiResponse<Void> linkWallet(
            Authentication authentication,
            @Valid @RequestBody WalletLinkRequest request
    ) {
        String userId = (String) authentication.getPrincipal();
        userService.linkWallet(userId, request.walletAddress());
        return ApiResponse.ok(200, "지갑 연동 성공");
    }

    @Operation(summary = "KYC 인증 완료 처리",
            description = "프론트에서 KYC를 마친 뒤 호출. kycVerified를 true로 설정합니다.")
    @PostMapping("/me/kyc")
    public ApiResponse<Void> completeKyc(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        userService.completeKyc(userId);
        return ApiResponse.ok(200, "KYC 인증 완료 처리 성공");
    }

    @Operation(summary = "신용 점수 체크 완료 처리",
            description = "프론트에서 Plaid 신용 점수 체크를 마친 뒤 호출. creditCheckCompleted를 true로 설정합니다.")
    @PostMapping("/me/credit-check")
    public ApiResponse<Void> completeCreditCheck(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        userService.completeCreditCheck(userId);
        return ApiResponse.ok(200, "신용 점수 체크 완료 처리 성공");
    }

    @Operation(summary = "KYC + 신용 점수 인증 상태 조회",
            description = "현재 사용자의 KYC와 신용 점수 체크 인증 여부를 한 번에 조회합니다.")
    @GetMapping("/me/verifications")
    public ApiResponse<VerificationStatusResponse> getVerificationStatus(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        VerificationStatusResponse status = userService.getVerificationStatus(userId);
        return ApiResponse.ok(status);
    }
}
