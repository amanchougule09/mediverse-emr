package com.amanchougule.clinic_emr.appointment.service;

import com.amanchougule.clinic_emr.appointment.dto.AppointmentRequest;
import com.amanchougule.clinic_emr.appointment.dto.AppointmentResponse;

import java.util.List;

public interface AppointmentService {

    AppointmentResponse createAppointment(AppointmentRequest request);

    AppointmentResponse getAppointmentById(Long id);

    List<AppointmentResponse> getAllAppointments();

    AppointmentResponse updateAppointment(Long id, AppointmentRequest request);

    void deleteAppointment(Long id);
}