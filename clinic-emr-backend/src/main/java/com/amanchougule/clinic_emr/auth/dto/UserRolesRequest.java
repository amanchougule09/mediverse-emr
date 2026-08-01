package com.amanchougule.clinic_emr.auth.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserRolesRequest {

    private List<Long> roleIds;
}
