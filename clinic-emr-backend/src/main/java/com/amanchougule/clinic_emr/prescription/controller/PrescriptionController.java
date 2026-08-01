package com.amanchougule.clinic_emr.prescription.controller;

import com.amanchougule.clinic_emr.prescription.dto.PrescriptionRequest;
import com.amanchougule.clinic_emr.prescription.dto.PrescriptionResponse;
import com.amanchougule.clinic_emr.prescription.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('prescription:create')")
    public PrescriptionResponse createPrescription(
            @Valid @RequestBody PrescriptionRequest request) {

        return prescriptionService.createPrescription(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('prescription:view')")
    public PrescriptionResponse getPrescriptionById(
            @PathVariable Long id) {

        return prescriptionService.getPrescriptionById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('prescription:view')")
    public List<PrescriptionResponse> getAllPrescriptions() {

        return prescriptionService.getAllPrescriptions();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('prescription:update')")
    public PrescriptionResponse updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionRequest request) {

        return prescriptionService.updatePrescription(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('prescription:delete')")
    public void deletePrescription(@PathVariable Long id) {

        prescriptionService.deletePrescription(id);
    }
}