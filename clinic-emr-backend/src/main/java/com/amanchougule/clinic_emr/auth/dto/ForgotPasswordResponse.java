package com.amanchougule.clinic_emr.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ForgotPasswordResponse {

    private String message;

    private String resetToken;
}
