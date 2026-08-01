package com.amanchougule.clinic_emr.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @Email(message = "A valid email is required")
    @NotBlank(message = "Email is required")
    private String email;
}
