package org.landmark.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.landmark.domain.user.domain.User;
import org.landmark.domain.user.dto.VerificationStatusResponse;
import org.landmark.domain.user.repository.UserRepository;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public void linkWallet(String userId, String walletAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.linkWallet(walletAddress);
    }

    @Transactional
    public void completeKyc(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.completeKyc();
    }

    @Transactional
    public void completeCreditCheck(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.completeCreditCheck();
    }

    @Transactional(readOnly = true)
    public VerificationStatusResponse getVerificationStatus(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return VerificationStatusResponse.from(user);
    }
}
