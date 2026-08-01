package com.amanchougule.clinic_emr.prescription.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItemResponse {

    private Long id;

    private String medicineName;

    private String dosage;

    private String frequency;

    private String duration;

    private String instructions;
}