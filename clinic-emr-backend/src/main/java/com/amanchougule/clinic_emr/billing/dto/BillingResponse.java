package com.amanchougule.clinic_emr.billing.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingResponse {

    private Long id;

    private String billNumber;

    private Long patientId;

    private String patientName;

    private Long appointmentId;

    private BigDecimal consultationFee;

    private BigDecimal medicineAmount;

    private BigDecimal laboratoryAmount;

    private BigDecimal discount;

    private BigDecimal totalAmount;

    private String paymentStatus;

    private String paymentMethod;
}