package com.amanchougule.clinic_emr.config;

import com.amanchougule.clinic_emr.auth.entity.Permission;
import com.amanchougule.clinic_emr.auth.entity.Role;
import com.amanchougule.clinic_emr.auth.entity.User;
import com.amanchougule.clinic_emr.auth.repository.PermissionRepository;
import com.amanchougule.clinic_emr.auth.repository.RoleRepository;
import com.amanchougule.clinic_emr.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final List<String> ALL_PERMISSIONS = List.of(
            "dashboard:view",

            "patient:view", "patient:create", "patient:update", "patient:delete",
            "doctor:view", "doctor:create", "doctor:update", "doctor:delete",
            "appointment:view", "appointment:create", "appointment:update", "appointment:delete",
            "consultation:view", "consultation:create", "consultation:update", "consultation:delete",
            "prescription:view", "prescription:create", "prescription:update", "prescription:delete",
            "billing:view", "billing:create", "billing:update", "billing:delete",
            "laboratory:view", "laboratory:create", "laboratory:update", "laboratory:delete",
            "pharmacy:view", "pharmacy:create", "pharmacy:update", "pharmacy:delete",
            "notification:view", "notification:create", "notification:update", "notification:delete",
            "audit:view", "audit:create", "audit:delete",
            "file:view", "file:create", "file:update", "file:delete", "file:download",
            "user:view", "user:manage",
            "role:view", "role:manage"
    );

    private static final Map<String, List<String>> ROLE_PERMISSIONS = Map.of(
            "ROLE_DOCTOR", List.of(
                    "dashboard:view",
                    "patient:view",
                    "appointment:view",
                    "consultation:view", "consultation:create", "consultation:update",
                    "prescription:view", "prescription:create", "prescription:update",
                    "file:view", "file:create", "file:download",
                    "notification:view"),
            "ROLE_RECEPTIONIST", List.of(
                    "dashboard:view",
                    "patient:view", "patient:create", "patient:update",
                    "appointment:view", "appointment:create", "appointment:update",
                    "consultation:view",
                    "billing:view",
                    "file:create",
                    "notification:view"),
            "ROLE_PHARMACIST", List.of(
                    "dashboard:view",
                    "prescription:view",
                    "pharmacy:view", "pharmacy:create", "pharmacy:update",
                    "notification:view"),
            "ROLE_LAB_TECHNICIAN", List.of(
                    "dashboard:view",
                    "laboratory:view", "laboratory:create", "laboratory:update",
                    "notification:view"),
            "ROLE_ACCOUNTANT", List.of(
                    "dashboard:view",
                    "billing:view", "billing:create", "billing:update",
                    "notification:view")
    );

    @Override
    @Transactional
    public void run(String... args) {

        createPermissions();
        createRoles();
        assignPermissions();
        createDefaultAdmin();
    }

    private void createPermissions() {

        ALL_PERMISSIONS.forEach(name -> {
            if (!permissionRepository.existsByName(name)) {

                permissionRepository.save(Permission.builder()
                        .name(name)
                        .description(name + " permission")
                        .build());
            }
        });
    }

    private void createRoles() {

        createRole("ROLE_SUPER_ADMIN", "System Super Admin");
        createRole("ROLE_CLINIC_ADMIN", "Clinic Administrator");
        createRole("ROLE_DOCTOR", "Doctor");
        createRole("ROLE_RECEPTIONIST", "Receptionist");
        createRole("ROLE_PHARMACIST", "Pharmacist");
        createRole("ROLE_LAB_TECHNICIAN", "Laboratory Technician");
        createRole("ROLE_ACCOUNTANT", "Accountant");
    }

    private void createRole(String name, String description) {

        if (!roleRepository.existsByName(name)) {

            roleRepository.save(Role.builder()
                    .name(name)
                    .description(description)
                    .build());
        }
    }

    private void assignPermissions() {

        roleRepository.findByName("ROLE_SUPER_ADMIN").ifPresent(role -> {
            role.getPermissions().addAll(findPermissions(ALL_PERMISSIONS));
            roleRepository.save(role);
        });

        roleRepository.findByName("ROLE_CLINIC_ADMIN").ifPresent(role -> {
            List<String> clinicAdminPermissions = ALL_PERMISSIONS.stream()
                    .filter(name -> !name.equals("role:manage"))
                    .toList();
            role.getPermissions().addAll(findPermissions(clinicAdminPermissions));
            roleRepository.save(role);
        });

        ROLE_PERMISSIONS.forEach((roleName, permissionNames) ->
                roleRepository.findByName(roleName).ifPresent(role -> {
                    role.getPermissions().addAll(findPermissions(permissionNames));
                    roleRepository.save(role);
                }));
    }

    private Set<Permission> findPermissions(List<String> names) {

        return names.stream()
                .map(permissionRepository::findByName)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
    }

    private void createDefaultAdmin() {

        if (userRepository.existsByUsername("admin")) {
            return;
        }

        roleRepository.findByName("ROLE_SUPER_ADMIN").ifPresent(role ->
                userRepository.save(User.builder()
                        .username("admin")
                        .email("admin@clinic.com")
                        .password(passwordEncoder.encode("Admin@123"))
                        .firstName("System")
                        .lastName("Admin")
                        .roles(new HashSet<>(Set.of(role)))
                        .build()));
    }
}
