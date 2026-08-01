package com.amanchougule.clinic_emr.patient.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PatientRequest {

    @NotBlank
    private String firstName;

    private String middleName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String gender;

    private LocalDate dateOfBirth;

    private String bloodGroup;

    @NotBlank
    private String mobile;

    private String email;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private String emergencyContactName;

    private String emergencyContactNumber;

    private String maritalStatus;

    private String occupation;

    private String aadhaarNumber;

    private String insuranceNumber;

    private BigDecimal height;

    private BigDecimal weight;

    private String allergies;

    private String chronicDiseases;
}