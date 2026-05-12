package org.landmark.domain.governance.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.landmark.global.dto.ApiResponse;
import org.landmark.domain.governance.dto.ProposalResponse;
import org.landmark.domain.governance.service.GovernanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/governance")
@RequiredArgsConstructor
@Tag(name = "Governance", description = "거버넌스 제안 관리 API")
public class GovernanceController {
  private final GovernanceService governanceService;

  @Operation(summary = "제안 목록 조회", description = "활성화된 거버넌스 제안 목록을 조회합니다. propertyId로 필터링할 수 있습니다.")
  @GetMapping("/proposals")
  public ResponseEntity<ApiResponse<List<ProposalResponse>>> getAllActiveProposals(
      @RequestParam(required = false) String propertyId
  ) {
    List<ProposalResponse> proposals = governanceService.findAllProposals(propertyId);

    return ResponseEntity.ok(ApiResponse.ok(proposals));
  }

  @Operation(summary = "제안 취소", description = "생성된 거버넌스 제안을 취소합니다.")
  @DeleteMapping("/proposals/{proposalId}")
  public ResponseEntity<ApiResponse<Object>> cancelProposal(
      Authentication authentication,
      @PathVariable Long proposalId
  ) {
    String userId = (String) authentication.getPrincipal();
    Long canceledId = governanceService.cancelProposal(userId, proposalId);

    Map<String, Long> responseData = Map.of("proposalId", canceledId);

    return ResponseEntity.ok(ApiResponse.ok(
        HttpStatus.OK.value(), "제안이 성공적으로 취소되었습니다.", responseData
    ));
  }
}
