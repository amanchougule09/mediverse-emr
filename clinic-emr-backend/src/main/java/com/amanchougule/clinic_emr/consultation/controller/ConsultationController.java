package com.amanchougule.clinic_emr.consultation.controller;

import com.amanchougule.clinic_emr.consultation.dto.ConsultationRequest;
import com.amanchougule.clinic_emr.consultation.dto.ConsultationResponse;
import com.amanchougule.clinic_emr.consultation.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    @PostMapping
    @PreAuthorize("hasAuthority('consultation:create')")
    public ConsultationResponse createConsultation(
            @Valid @RequestBody ConsultationRequest request) {

        return consultationService.createConsultation(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('consultation:view')")
    public ConsultationResponse getConsultationById(
            @PathVariable Long id) {

        return consultationService.getConsultationById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('consultation:view')")
    public List<ConsultationResponse> getAllConsultations() {

        return consultationService.getAllConsultations();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('consultation:update')")
    public ConsultationResponse updateConsultation(
            @PathVariable Long id,
            @Valid @RequestBody ConsultationRequest request) {

        return consultationService.updateConsultation(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('consultation:delete')")
    public String deleteConsultation(@PathVariable Long id) {

        consultationService.deleteConsultation(id);

        return "Consultation deleted successfully.";
    }
}