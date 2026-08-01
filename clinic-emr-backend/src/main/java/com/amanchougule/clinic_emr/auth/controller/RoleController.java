package com.amanchougule.clinic_emr.auth.controller;

import com.amanchougule.clinic_emr.auth.dto.RolePermissionsRequest;
import com.amanchougule.clinic_emr.auth.dto.RoleRequest;
import com.amanchougule.clinic_emr.auth.dto.RoleResponse;
import com.amanchougule.clinic_emr.auth.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasAuthority('role:view')")
    public List<RoleResponse> getAllRoles() {

        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('role:view')")
    public RoleResponse getRoleById(@PathVariable Long id) {

        return roleService.getRoleById(id);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('role:manage')")
    public RoleResponse createRole(
            @Valid @RequestBody RoleRequest request) {

        return roleService.createRole(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('role:manage')")
    public RoleResponse updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleRequest request) {

        return roleService.updateRole(id, request);
    }

    @PutMapping("/{id}/permissions")
    @PreAuthorize("hasAuthority('role:manage')")
    public RoleResponse updateRolePermissions(
            @PathVariable Long id,
            @RequestBody RolePermissionsRequest request) {

        return roleService.updateRolePermissions(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('role:manage')")
    public String deleteRole(@PathVariable Long id) {

        roleService.deleteRole(id);

        return "Role deleted successfully.";
    }
}
