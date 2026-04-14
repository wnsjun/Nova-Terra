package org.landmark.global.scheduler.dto;

import org.landmark.global.scheduler.domain.SchedulerRunLog;
import org.landmark.global.scheduler.domain.SchedulerRunStatus;

import java.time.LocalDateTime;

public record SchedulerRunLogResponse(
        String id,
        String jobName,
        LocalDateTime startedAt,
        LocalDateTime finishedAt,
        SchedulerRunStatus status,
        int processedCount,
        int failedCount,
        String errorMessage,
        Long durationMs
) {
    public static SchedulerRunLogResponse of(SchedulerRunLog log) {
        Long duration = (log.getStartedAt() != null && log.getFinishedAt() != null)
                ? java.time.Duration.between(log.getStartedAt(), log.getFinishedAt()).toMillis()
                : null;
        return new SchedulerRunLogResponse(
                log.getId(),
                log.getJobName(),
                log.getStartedAt(),
                log.getFinishedAt(),
                log.getStatus(),
                log.getProcessedCount(),
                log.getFailedCount(),
                log.getErrorMessage(),
                duration
        );
    }
}
