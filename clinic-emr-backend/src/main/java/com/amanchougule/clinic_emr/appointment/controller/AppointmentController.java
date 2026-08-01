package com.amanchougule.clinic_emr.appointment.controller;

import com.amanchougule.clinic_emr.appointment.dto.AppointmentRequest;
import com.amanchougule.clinic_emr.appointment.dto.AppointmentResponse;
import com.amanchougule.clinic_emr.appointment.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('appointment:create')")
    public AppointmentResponse createAppointment(
            @RequestBody AppointmentRequest request) {

        return appointmentService.createAppointment(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('appointment:view')")
    public AppointmentResponse getAppointment(@PathVariable Long id) {

        return appointmentService.getAppointmentById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('appointment:view')")
    public List<AppointmentResponse> getAllAppointments() {

        return appointmentService.getAllAppointments();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('appointment:update')")
    public AppointmentResponse updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentRequest request) {

        return appointmentService.updateAppointment(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('appointment:delete')")
    public void deleteAppointment(@PathVariable Long id) {

        appointmentService.deleteAppointment(id);
    }
}