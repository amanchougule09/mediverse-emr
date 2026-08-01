package com.amanchougule.clinic_emr.doctor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoctorRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotBlank(message = "Mobile is required")
    private String mobile;

    @Email(message = "Invalid email")
    private String email;

    private String qualification;

    private Integer experience;

    private String gender;

    private String address;
}