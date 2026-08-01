package com.amanchougule.clinic_emr.doctor.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorResponse {

    private Long id;

    private String doctorCode;

    private String firstName;

    private String lastName;

    private String specialization;

    private String mobile;

    private String email;

    private String qualification;

    private Integer experience;

    private String gender;

    private Boolean active;
}