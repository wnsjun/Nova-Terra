package org.landmark.global.scheduler.runlog;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.scheduler.domain.SchedulerRunLog;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class SchedulerRunLogger {

    private final SchedulerRunLogTransactionService txService;

    public record Result(int processed, int failed) {}

    public void run(String jobName, Supplier<Result> task) {
        SchedulerRunLog runLog = txService.saveStart(jobName);
        try {
            Result result = task.get();
            txService.saveFinish(runLog.getId(), result.processed(), result.failed());
        } catch (Exception e) {
            log.error("스케줄러 실행 실패 - jobName: {}", jobName, e);
            txService.saveFailure(runLog.getId(), e.getMessage());
            throw e;
        }
    }

    public void runVoid(String jobName, Runnable task) {
        run(jobName, () -> {
            task.run();
            return new Result(0, 0);
        });
    }
}
