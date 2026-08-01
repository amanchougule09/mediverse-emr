package com.amanchougule.clinic_emr.patient.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientResponse {

    private Long id;

    private String patientCode;

    private String fullName;

    private String gender;

    private String mobile;

    private String email;

    private Boolean active;
}