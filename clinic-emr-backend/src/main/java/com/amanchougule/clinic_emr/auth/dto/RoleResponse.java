package com.amanchougule.clinic_emr.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class RoleResponse {

    private Long id;
    private String name;
    private String description;
    private List<String> permissions;
}
