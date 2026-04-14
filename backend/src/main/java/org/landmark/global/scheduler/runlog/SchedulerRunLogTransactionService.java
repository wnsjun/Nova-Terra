package org.landmark.global.scheduler.runlog;

import lombok.RequiredArgsConstructor;
import org.landmark.global.scheduler.domain.SchedulerRunLog;
import org.landmark.global.scheduler.repository.SchedulerRunLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SchedulerRunLogTransactionService {

    private final SchedulerRunLogRepository runLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public SchedulerRunLog saveStart(String jobName) {
        return runLogRepository.save(SchedulerRunLog.start(jobName));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveFinish(String id, int processed, int failed) {
        runLogRepository.findById(id).ifPresent(log -> log.finishSuccess(processed, failed));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveFailure(String id, String error) {
        runLogRepository.findById(id).ifPresent(log -> log.finishFailed(error));
    }
}
