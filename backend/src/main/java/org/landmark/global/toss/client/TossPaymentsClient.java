package org.landmark.global.toss.client;

import org.landmark.global.toss.dto.TossPaymentInquiryResponse;
import org.landmark.global.toss.dto.TossVirtualAccountRequest;
import org.landmark.global.toss.dto.TossVirtualAccountResponse;

public interface TossPaymentsClient {
    TossVirtualAccountResponse issueVirtualAccount(TossVirtualAccountRequest request);

    TossPaymentInquiryResponse getPaymentByOrderId(String orderId);
}
