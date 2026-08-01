package com.amanchougule.clinic_emr.auth.service;

import com.amanchougule.clinic_emr.auth.dto.AuthResponse;
import com.amanchougule.clinic_emr.auth.dto.ForgotPasswordRequest;
import com.amanchougule.clinic_emr.auth.dto.ForgotPasswordResponse;
import com.amanchougule.clinic_emr.auth.dto.RegisterRequest;
import com.amanchougule.clinic_emr.auth.dto.ResetPasswordRequest;
import com.amanchougule.clinic_emr.auth.entity.Permission;
import com.amanchougule.clinic_emr.auth.entity.Role;
import com.amanchougule.clinic_emr.auth.entity.User;
import com.amanchougule.clinic_emr.auth.repository.RoleRepository;
import com.amanchougule.clinic_emr.auth.repository.UserRepository;
import com.amanchougule.clinic_emr.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amanchougule.clinic_emr.auth.dto.LoginRequest;
import com.amanchougule.clinic_emr.auth.dto.LoginResponse;
import com.amanchougule.clinic_emr.security.jwt.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        String username = request.getUsername().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username already exists.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists.");
        }

        User user = User.builder()
                .username(username)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .roles(new HashSet<>())
                .build();

        userRepository.save(user);

        return new AuthResponse("User registered successfully. An administrator must assign a role before you can access the system.");
    }
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String username = request.getUsername().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("User not found."));

        return buildLoginResponse(user);
    }

    @Transactional(readOnly = true)
    public LoginResponse getCurrentUser(User user) {

        return buildLoginResponse(user);
    }

    private LoginResponse buildLoginResponse(User user) {

        String token = jwtService.generateToken(user.getUsername());

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        Set<String> permissionNames = user.getRoles().stream()
                .map(Role::getPermissions)
                .flatMap(Set::stream)
                .map(Permission::getName)
                .collect(Collectors.toSet());

        String role = roleNames.stream().findFirst().orElse("ROLE_USER");

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .username(user.getUsername())
                .role(role)
                .roles(List.copyOf(roleNames))
                .permissions(List.copyOf(permissionNames))
                .build();
    }

    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No account found with that email."));

        String token = UUID.randomUUID().toString();

        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        return new ForgotPasswordResponse(
                "A password reset token has been generated. Use it to reset your password.",
                token
        );
    }

    public AuthResponse resetPassword(ResetPasswordRequest request) {

        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token."));

        if (user.getPasswordResetTokenExpiry() == null
                || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);

        return new AuthResponse("Password reset successfully. You can now sign in.");
    }
}