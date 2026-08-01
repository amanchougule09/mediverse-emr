package com.amanchougule.clinic_emr.prescription.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponse {

    private Long id;

    private String prescriptionCode;

    private Long appointmentId;

    private Long patientId;

    private String patientName;

    private Long doctorId;

    private String doctorName;

    private String diagnosis;

    private String advice;

    private List<PrescriptionItemResponse> items;
}