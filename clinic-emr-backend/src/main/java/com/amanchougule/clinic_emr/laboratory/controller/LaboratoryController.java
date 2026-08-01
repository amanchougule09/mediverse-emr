package com.amanchougule.clinic_emr.laboratory.controller;

import com.amanchougule.clinic_emr.laboratory.dto.LaboratoryRequest;
import com.amanchougule.clinic_emr.laboratory.dto.LaboratoryResponse;
import com.amanchougule.clinic_emr.laboratory.service.LaboratoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laboratory")
@RequiredArgsConstructor
public class LaboratoryController {

    private final LaboratoryService laboratoryService;

    @PostMapping
    @PreAuthorize("hasAuthority('laboratory:create')")
    public LaboratoryResponse createTest(
            @Valid @RequestBody LaboratoryRequest request) {

        return laboratoryService.createTest(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('laboratory:view')")
    public LaboratoryResponse getTestById(
            @PathVariable Long id) {

        return laboratoryService.getTestById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('laboratory:view')")
    public List<LaboratoryResponse> getAllTests() {

        return laboratoryService.getAllTests();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('laboratory:update')")
    public LaboratoryResponse updateTest(
            @PathVariable Long id,
            @Valid @RequestBody LaboratoryRequest request) {

        return laboratoryService.updateTest(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('laboratory:delete')")
    public String deleteTest(
            @PathVariable Long id) {

        laboratoryService.deleteTest(id);

        return "Laboratory test deleted successfully.";
    }
}