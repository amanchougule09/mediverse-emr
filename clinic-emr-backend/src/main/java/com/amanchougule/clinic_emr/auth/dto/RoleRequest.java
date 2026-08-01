package com.amanchougule.clinic_emr.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoleRequest {

    @NotBlank
    private String name;

    private String description;
}
