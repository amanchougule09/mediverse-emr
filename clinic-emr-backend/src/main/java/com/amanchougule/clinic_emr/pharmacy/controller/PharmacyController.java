package com.amanchougule.clinic_emr.pharmacy.controller;

import com.amanchougule.clinic_emr.pharmacy.dto.PharmacyRequest;
import com.amanchougule.clinic_emr.pharmacy.dto.PharmacyResponse;
import com.amanchougule.clinic_emr.pharmacy.service.PharmacyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    @PostMapping
    @PreAuthorize("hasAuthority('pharmacy:create')")
    public PharmacyResponse createMedicine(
            @Valid @RequestBody PharmacyRequest request) {

        return pharmacyService.createMedicine(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('pharmacy:view')")
    public PharmacyResponse getMedicineById(
            @PathVariable Long id) {

        return pharmacyService.getMedicineById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('pharmacy:view')")
    public List<PharmacyResponse> getAllMedicines() {

        return pharmacyService.getAllMedicines();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('pharmacy:update')")
    public PharmacyResponse updateMedicine(
            @PathVariable Long id,
            @Valid @RequestBody PharmacyRequest request) {

        return pharmacyService.updateMedicine(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('pharmacy:delete')")
    public String deleteMedicine(
            @PathVariable Long id) {

        pharmacyService.deleteMedicine(id);

        return "Medicine deleted successfully.";
    }
}