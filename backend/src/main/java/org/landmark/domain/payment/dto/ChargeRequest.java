package org.landmark.domain.payment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ChargeRequest(
        @NotNull @Min(1000) Long amount
) {}
