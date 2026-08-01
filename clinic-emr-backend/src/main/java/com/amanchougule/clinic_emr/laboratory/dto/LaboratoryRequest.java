package com.amanchougule.clinic_emr.laboratory.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LaboratoryRequest {

    private Long patientId;

    private Long doctorId;

    private Long appointmentId;

    private String testName;

    private String sampleType;

    private String testStatus;

    private String result;

    private String remarks;

    private LocalDate testDate;

}