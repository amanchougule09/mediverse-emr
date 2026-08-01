package com.amanchougule.clinic_emr.auth.controller;

import com.amanchougule.clinic_emr.auth.dto.UserResponse;
import com.amanchougule.clinic_emr.auth.dto.UserRolesRequest;
import com.amanchougule.clinic_emr.auth.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserAdminService userAdminService;

    @GetMapping
    @PreAuthorize("hasAuthority('user:view')")
    public List<UserResponse> getAllUsers() {

        return userAdminService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('user:view')")
    public UserResponse getUserById(@PathVariable Long id) {

        return userAdminService.getUserById(id);
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('user:manage')")
    public UserResponse updateUserRoles(
            @PathVariable Long id,
            @RequestBody UserRolesRequest request) {

        return userAdminService.updateUserRoles(id, request);
    }
}
