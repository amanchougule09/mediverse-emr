package com.amanchougule.clinic_emr.appointment.service.impl;

import com.amanchougule.clinic_emr.appointment.dto.AppointmentRequest;
import com.amanchougule.clinic_emr.appointment.dto.AppointmentResponse;
import com.amanchougule.clinic_emr.appointment.entity.Appointment;
import com.amanchougule.clinic_emr.appointment.repository.AppointmentRepository;
import com.amanchougule.clinic_emr.appointment.service.AppointmentService;
import com.amanchougule.clinic_emr.doctor.entity.Doctor;
import com.amanchougule.clinic_emr.doctor.repository.DoctorRepository;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import com.amanchougule.clinic_emr.patient.entity.Patient;
import com.amanchougule.clinic_emr.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public AppointmentResponse createAppointment(AppointmentRequest request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .appointmentCode(generateAppointmentCode())
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .reason(request.getReason())
                .notes(request.getNotes())
                .status("SCHEDULED")
                .build();

        appointment = appointmentRepository.save(appointment);

        return mapToResponse(appointment);
    }

    @Override
    public AppointmentResponse getAppointmentById(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        return mapToResponse(appointment);
    }

    @Override
    public List<AppointmentResponse> getAllAppointments() {

        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AppointmentResponse updateAppointment(Long id,
                                                 AppointmentRequest request) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());

        appointmentRepository.save(appointment);

        return mapToResponse(appointment);
    }

    @Override
    public void deleteAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        appointmentRepository.delete(appointment);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {

        return AppointmentResponse.builder()
                .id(appointment.getId())
                .appointmentCode(appointment.getAppointmentCode())

                .patientId(appointment.getPatient().getId())
                .patientName(
                        appointment.getPatient().getFirstName()
                                + " "
                                + appointment.getPatient().getLastName())

                .doctorId(appointment.getDoctor().getId())
                .doctorName(
                        appointment.getDoctor().getFirstName()
                                + " "
                                + appointment.getDoctor().getLastName())

                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .build();
    }

    private String generateAppointmentCode() {
        return "APT-" + System.currentTimeMillis();
    }
}