package com.amanchougule.clinic_emr.doctor.controller;

import com.amanchougule.clinic_emr.doctor.dto.DoctorRequest;
import com.amanchougule.clinic_emr.doctor.dto.DoctorResponse;
import com.amanchougule.clinic_emr.doctor.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    @PreAuthorize("hasAuthority('doctor:create')")
    public DoctorResponse createDoctor(
            @Valid @RequestBody DoctorRequest request) {

        return doctorService.createDoctor(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('doctor:view')")
    public DoctorResponse getDoctorById(@PathVariable Long id) {

        return doctorService.getDoctorById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('doctor:view')")
    public List<DoctorResponse> getAllDoctors() {

        return doctorService.getAllDoctors();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('doctor:update')")
    public DoctorResponse updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequest request) {

        return doctorService.updateDoctor(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('doctor:delete')")
    public String deleteDoctor(@PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return "Doctor deleted successfully.";
    }
}