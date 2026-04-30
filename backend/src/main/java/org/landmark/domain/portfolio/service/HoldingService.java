package org.landmark.domain.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.portfolio.domain.UserHolding;
import org.landmark.domain.portfolio.repository.UserHoldingRepository;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.landmark.domain.user.domain.User;
import org.landmark.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class HoldingService {

    private final UserHoldingRepository userHoldingRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    /**
     * PropertyToken 컨트랙트의 TokensPurchased 이벤트로부터 호출됨.
     * 동일 사용자/부동산이면 누적 합산 update, 신규면 insert.
     */
    @Transactional
    public void recordPurchase(String buyerWalletAddress, String propertyId,
                               Long amount, Long krwtCost) {
        User user = userRepository.findByWalletAddress(buyerWalletAddress).orElse(null);
        if (user == null) {
            log.warn("TokensPurchased 이벤트 — 등록되지 않은 지갑 주소, 스킵 - buyer: {}, propertyId: {}",
                    buyerWalletAddress, propertyId);
            return;
        }

        Property property = propertyRepository.findById(propertyId).orElse(null);
        if (property == null) {
            log.warn("TokensPurchased 이벤트 — 등록되지 않은 부동산, 스킵 - propertyId: {}", propertyId);
            return;
        }

        userHoldingRepository.findByUserIdAndPropertyId(user.getId(), propertyId)
                .ifPresentOrElse(
                        existing -> {
                            existing.addPurchase(amount, krwtCost);
                            log.info("UserHolding 누적 update - userId: {}, propertyId: {}, +amount: {}, +cost: {}, 총amount: {}, 총cost: {}",
                                    user.getId(), propertyId, amount, krwtCost,
                                    existing.getAmount(), existing.getKrwtCost());
                        },
                        () -> {
                            UserHolding created = UserHolding.builder()
                                    .user(user)
                                    .property(property)
                                    .amount(amount)
                                    .krwtCost(krwtCost)
                                    .build();
                            userHoldingRepository.save(created);
                            log.info("UserHolding 신규 insert - userId: {}, propertyId: {}, amount: {}, cost: {}",
                                    user.getId(), propertyId, amount, krwtCost);
                        }
                );
    }
}
