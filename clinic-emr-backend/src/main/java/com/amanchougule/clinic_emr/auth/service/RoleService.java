package com.amanchougule.clinic_emr.auth.service;

import com.amanchougule.clinic_emr.auth.dto.PermissionResponse;
import com.amanchougule.clinic_emr.auth.dto.RolePermissionsRequest;
import com.amanchougule.clinic_emr.auth.dto.RoleRequest;
import com.amanchougule.clinic_emr.auth.dto.RoleResponse;
import com.amanchougule.clinic_emr.auth.entity.Permission;
import com.amanchougule.clinic_emr.auth.entity.Role;
import com.amanchougule.clinic_emr.auth.repository.PermissionRepository;
import com.amanchougule.clinic_emr.auth.repository.RoleRepository;
import com.amanchougule.clinic_emr.exception.BadRequestException;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {

        return roleRepository.findAll().stream()
                .map(this::toResponse)
                .sorted(Comparator.comparing(RoleResponse::getName))
                .toList();
    }

    @Transactional(readOnly = true)
    public RoleResponse getRoleById(Long id) {

        return toResponse(findRole(id));
    }

    @Transactional
    public RoleResponse createRole(RoleRequest request) {

        String name = normalizeName(request.getName());

        if (roleRepository.existsByName(name)) {
            throw new BadRequestException("Role '" + name + "' already exists.");
        }

        Role role = Role.builder()
                .name(name)
                .description(request.getDescription())
                .build();

        return toResponse(roleRepository.save(role));
    }

    @Transactional
    public RoleResponse updateRole(Long id, RoleRequest request) {

        Role role = findRole(id);

        if (role.getName().equals("ROLE_SUPER_ADMIN")) {
            throw new BadRequestException("The system super admin role cannot be modified.");
        }

        role.setName(normalizeName(request.getName()));
        role.setDescription(request.getDescription());

        return toResponse(roleRepository.save(role));
    }

    @Transactional
    public RoleResponse updateRolePermissions(Long id, RolePermissionsRequest request) {

        Role role = findRole(id);

        Set<Long> ids = request.getPermissionIds() == null
                ? Set.of()
                : new HashSet<>(request.getPermissionIds());

        Set<Permission> permissions = permissionRepository.findAllById(ids)
                .stream()
                .collect(Collectors.toSet());

        role.setPermissions(permissions);

        return toResponse(roleRepository.save(role));
    }

    @Transactional
    public void deleteRole(Long id) {

        Role role = findRole(id);

        if (role.getName().equals("ROLE_SUPER_ADMIN")) {
            throw new BadRequestException("The system super admin role cannot be deleted.");
        }

        try {
            roleRepository.delete(role);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("This role is assigned to users and cannot be deleted.");
        }
    }

    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {

        return permissionRepository.findAll().stream()
                .map(permission -> PermissionResponse.builder()
                        .id(permission.getId())
                        .name(permission.getName())
                        .description(permission.getDescription())
                        .build())
                .sorted(Comparator.comparing(PermissionResponse::getName))
                .toList();
    }

    private Role findRole(Long id) {

        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found."));
    }

    private String normalizeName(String name) {

        String trimmed = name == null ? "" : name.trim();

        if (trimmed.isEmpty()) {
            throw new BadRequestException("Role name is required.");
        }

        return trimmed.startsWith("ROLE_")
                ? trimmed.toUpperCase()
                : "ROLE_" + trimmed.toUpperCase();
    }

    private RoleResponse toResponse(Role role) {

        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .permissions(role.getPermissions().stream()
                        .map(Permission::getName)
                        .sorted()
                        .toList())
                .build();
    }
}
