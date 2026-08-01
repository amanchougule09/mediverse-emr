package com.amanchougule.clinic_emr.patient.controller;

import com.amanchougule.clinic_emr.patient.dto.PatientRequest;
import com.amanchougule.clinic_emr.patient.dto.PatientResponse;
import com.amanchougule.clinic_emr.patient.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    @PreAuthorize("hasAuthority('patient:create')")
    public PatientResponse createPatient(
            @Valid @RequestBody PatientRequest request) {

        return patientService.createPatient(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('patient:view')")
    public PatientResponse getPatient(@PathVariable Long id) {

        return patientService.getPatientById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('patient:view')")
    public List<PatientResponse> getAllPatients() {

        return patientService.getAllPatients();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('patient:view')")
    public List<PatientResponse> searchPatients(
            @RequestParam String keyword) {

        return patientService.searchPatients(keyword);
    }

    @GetMapping("/page")
    @PreAuthorize("hasAuthority('patient:view')")
    public Page<PatientResponse> getPatients(

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return patientService.getPatients(page, size);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('patient:update')")
    public PatientResponse updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequest request) {

        return patientService.updatePatient(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('patient:delete')")
    public String deletePatient(@PathVariable Long id){
        patientService.deletePatient(id);

        return "Patient deactivated successfully";
    }
}