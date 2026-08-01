package com.amanchougule.clinic_emr.prescription.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionRequest {

    @NotNull
    private Long appointmentId;

    private String diagnosis;

    private String advice;

    @Valid
    private List<PrescriptionItemRequest> items;
}