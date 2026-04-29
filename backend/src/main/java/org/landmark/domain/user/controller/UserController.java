package org.landmark.domain.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.landmark.domain.user.dto.WalletLinkRequest;
import org.landmark.domain.user.service.UserService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.security.core.Authentication;
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

    @Operation(summary = "KYC + 신용 점수 인증 완료 처리",
            description = "프론트에서 KYC와 Plaid 신용 점수 체크를 마친 뒤 호출. 두 인증 플래그를 모두 true로 설정합니다.")
    @PostMapping("/me/verifications")
    public ApiResponse<Void> completeVerification(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        userService.completeVerification(userId);
        return ApiResponse.ok(200, "인증 완료 처리 성공");
    }
}
