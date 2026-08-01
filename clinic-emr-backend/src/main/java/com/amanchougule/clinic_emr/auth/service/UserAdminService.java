package com.amanchougule.clinic_emr.auth.service;

import com.amanchougule.clinic_emr.auth.dto.UserResponse;
import com.amanchougule.clinic_emr.auth.dto.UserRolesRequest;
import com.amanchougule.clinic_emr.auth.entity.Role;
import com.amanchougule.clinic_emr.auth.entity.User;
import com.amanchougule.clinic_emr.auth.repository.RoleRepository;
import com.amanchougule.clinic_emr.auth.repository.UserRepository;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll().stream()
                .map(this::toResponse)
                .sorted(Comparator.comparing(UserResponse::getUsername))
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {

        return toResponse(findUser(id));
    }

    @Transactional
    public UserResponse updateUserRoles(Long id, UserRolesRequest request) {

        User user = findUser(id);

        Set<Long> ids = request.getRoleIds() == null
                ? Set.of()
                : new HashSet<>(request.getRoleIds());

        Set<Role> roles = roleRepository.findAllById(ids)
                .stream()
                .collect(Collectors.toSet());

        user.setRoles(roles);

        return toResponse(userRepository.save(user));
    }

    private User findUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    private UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .enabled(user.getEnabled())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .sorted()
                        .toList())
                .build();
    }
}
