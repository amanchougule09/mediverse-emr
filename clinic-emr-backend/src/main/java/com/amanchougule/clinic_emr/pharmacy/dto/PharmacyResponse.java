package com.amanchougule.clinic_emr.pharmacy.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyResponse {

    private Long id;

    private String medicineCode;

    private String medicineName;

    private String manufacturer;

    private String category;

    private String batchNumber;

    private LocalDate expiryDate;

    private Integer quantity;

    private BigDecimal unitPrice;

    private String supplierName;

    private String status;
}