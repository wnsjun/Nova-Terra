package org.landmark.global.scheduler.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.landmark.global.dto.ApiResponse;
import org.landmark.global.scheduler.dto.SchedulerRunLogResponse;
import org.landmark.global.scheduler.repository.SchedulerRunLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/schedulers")
@RequiredArgsConstructor
@Tag(name = "Admin Scheduler", description = "관리자 - 스케줄러 실행 이력")
public class AdminSchedulerController {

    private final SchedulerRunLogRepository runLogRepository;

    @Operation(summary = "스케줄러 실행 이력 조회", description = "최신순 정렬. jobName 파라미터로 필터링 가능.")
    @GetMapping("/runs")
    public ApiResponse<List<SchedulerRunLogResponse>> list(
            @RequestParam(required = false) String jobName,
            @RequestParam(defaultValue = "50") int size
    ) {
        PageRequest page = PageRequest.of(0, Math.min(size, 200));
        List<SchedulerRunLogResponse> result = (jobName == null || jobName.isBlank()
                ? runLogRepository.findAllByOrderByStartedAtDesc(page)
                : runLogRepository.findByJobNameOrderByStartedAtDesc(jobName, page))
                .stream()
                .map(SchedulerRunLogResponse::of)
                .toList();
        return ApiResponse.ok(result);
    }
}
