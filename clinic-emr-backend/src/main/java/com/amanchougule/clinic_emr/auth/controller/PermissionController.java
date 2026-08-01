package com.amanchougule.clinic_emr.auth.controller;

import com.amanchougule.clinic_emr.auth.dto.PermissionResponse;
import com.amanchougule.clinic_emr.auth.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasAuthority('role:view')")
    public List<PermissionResponse> getAllPermissions() {

        return roleService.getAllPermissions();
    }
}
