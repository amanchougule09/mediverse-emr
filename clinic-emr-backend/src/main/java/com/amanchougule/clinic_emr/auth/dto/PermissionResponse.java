package com.amanchougule.clinic_emr.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PermissionResponse {

    private Long id;
    private String name;
    private String description;
}
