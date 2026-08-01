package com.amanchougule.clinic_emr.auth.controller;

import com.amanchougule.clinic_emr.auth.dto.AuthResponse;
import com.amanchougule.clinic_emr.auth.dto.ForgotPasswordRequest;
import com.amanchougule.clinic_emr.auth.dto.ForgotPasswordResponse;
import com.amanchougule.clinic_emr.auth.dto.RegisterRequest;
import com.amanchougule.clinic_emr.auth.dto.ResetPasswordRequest;
import com.amanchougule.clinic_emr.auth.service.AuthService;
import com.amanchougule.clinic_emr.exception.UnauthorizedException;
import com.amanchougule.clinic_emr.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.amanchougule.clinic_emr.auth.dto.LoginRequest;
import com.amanchougule.clinic_emr.auth.dto.LoginResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> me(
            @AuthenticationPrincipal UserPrincipal principal) {

        if (principal == null) {
            throw new UnauthorizedException("Not authenticated.");
        }

        return ResponseEntity.ok(authService.getCurrentUser(principal.getUser()));
    }

    @PostMapping("/forgot-password")
    public ForgotPasswordResponse forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public AuthResponse resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return authService.resetPassword(request);
    }
}