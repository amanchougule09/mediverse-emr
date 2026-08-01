package com.amanchougule.clinic_emr.billing.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingRequest {

    private Long patientId;

    private Long appointmentId;

    private BigDecimal consultationFee;

    private BigDecimal medicineAmount;

    private BigDecimal laboratoryAmount;

    private BigDecimal discount;

    private String paymentStatus;

    private String paymentMethod;
}