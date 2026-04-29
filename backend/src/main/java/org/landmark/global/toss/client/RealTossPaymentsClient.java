package org.landmark.global.toss.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.landmark.global.toss.dto.TossPaymentInquiryResponse;
import org.landmark.global.toss.dto.TossVirtualAccountRequest;
import org.landmark.global.toss.dto.TossVirtualAccountResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
@RequiredArgsConstructor
public class RealTossPaymentsClient implements TossPaymentsClient {

    private final RestClient tossPaymentsRestClient;

    @Override
    public TossVirtualAccountResponse issueVirtualAccount(TossVirtualAccountRequest request) {
        log.info("토스페이먼츠 가상계좌 발급 요청 - orderId: {}, amount: {}",
                request.orderId(), request.amount());

        try {
            TossVirtualAccountResponse response = tossPaymentsRestClient.post()
                    .uri("/v1/virtual-accounts")
                    .body(request)
                    .retrieve()
                    .body(TossVirtualAccountResponse.class);

            if (response == null) {
                log.error("토스페이먼츠로부터 응답이 없습니다.");
                throw new BusinessException(ErrorCode.PAYMENT_API_ERROR);
            }

            log.info("가상계좌 발급 성공 - orderId: {}, accountNumber: {}",
                    response.orderId(), response.virtualAccount().accountNumber());
            return response;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("토스페이먼츠 API 통신 중 예외 발생", e);
            throw new BusinessException(ErrorCode.PAYMENT_API_ERROR);
        }
    }

    @Override
    public TossPaymentInquiryResponse getPaymentByOrderId(String orderId) {
        log.info("토스페이먼츠 결제 조회 요청 - orderId: {}", orderId);

        try {
            TossPaymentInquiryResponse response = tossPaymentsRestClient.get()
                    .uri("/v1/payments/orders/{orderId}", orderId)
                    .retrieve()
                    .body(TossPaymentInquiryResponse.class);

            if (response == null) {
                log.error("토스페이먼츠 결제 조회 응답 없음 - orderId: {}", orderId);
                throw new BusinessException(ErrorCode.PAYMENT_API_ERROR);
            }

            log.info("결제 조회 성공 - orderId: {}, paymentKey: {}, amount: {}, status: {}",
                    response.orderId(), response.paymentKey(), response.totalAmount(), response.status());
            return response;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("토스페이먼츠 결제 조회 중 예외 발생 - orderId: {}", orderId, e);
            throw new BusinessException(ErrorCode.PAYMENT_API_ERROR);
        }
    }
}
