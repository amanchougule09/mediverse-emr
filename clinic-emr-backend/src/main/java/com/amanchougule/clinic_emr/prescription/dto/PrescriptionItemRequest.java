package com.amanchougule.clinic_emr.prescription.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItemRequest {

    @NotBlank
    private String medicineName;

    private String dosage;

    private String frequency;

    private String duration;

    private String instructions;
}