package com.amanchougule.clinic_emr.laboratory.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LaboratoryResponse {

    private Long id;

    private String testCode;

    private Long patientId;

    private String patientName;

    private Long doctorId;

    private String doctorName;

    private Long appointmentId;

    private String testName;

    private String sampleType;

    private String testStatus;

    private String result;

    private String remarks;

    private LocalDate testDate;
}