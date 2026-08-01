package com.amanchougule.clinic_emr.laboratory.service.impl;

import com.amanchougule.clinic_emr.appointment.entity.Appointment;
import com.amanchougule.clinic_emr.appointment.repository.AppointmentRepository;
import com.amanchougule.clinic_emr.doctor.entity.Doctor;
import com.amanchougule.clinic_emr.doctor.repository.DoctorRepository;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import com.amanchougule.clinic_emr.laboratory.dto.LaboratoryRequest;
import com.amanchougule.clinic_emr.laboratory.dto.LaboratoryResponse;
import com.amanchougule.clinic_emr.laboratory.entity.LaboratoryTest;
import com.amanchougule.clinic_emr.laboratory.repository.LaboratoryRepository;
import com.amanchougule.clinic_emr.laboratory.service.LaboratoryService;
import com.amanchougule.clinic_emr.patient.entity.Patient;
import com.amanchougule.clinic_emr.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LaboratoryServiceImpl implements LaboratoryService {

    private final LaboratoryRepository laboratoryRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public LaboratoryResponse createTest(LaboratoryRequest request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        Appointment appointment = null;

        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Appointment not found"));
        }

        LaboratoryTest test = LaboratoryTest.builder()
                .testCode(generateTestCode())
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .testName(request.getTestName())
                .sampleType(request.getSampleType())
                .testStatus(request.getTestStatus())
                .result(request.getResult())
                .remarks(request.getRemarks())
                .testDate(request.getTestDate())
                .build();

        test = laboratoryRepository.save(test);

        return mapToResponse(test);
    }

    @Override
    public LaboratoryResponse getTestById(Long id) {

        LaboratoryTest test = laboratoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Laboratory test not found"));

        return mapToResponse(test);
    }

    @Override
    public List<LaboratoryResponse> getAllTests() {

        return laboratoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public LaboratoryResponse updateTest(Long id, LaboratoryRequest request) {

        LaboratoryTest test = laboratoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Laboratory test not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        Appointment appointment = null;

        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Appointment not found"));
        }

        test.setPatient(patient);
        test.setDoctor(doctor);
        test.setAppointment(appointment);
        test.setTestName(request.getTestName());
        test.setSampleType(request.getSampleType());
        test.setTestStatus(request.getTestStatus());
        test.setResult(request.getResult());
        test.setRemarks(request.getRemarks());
        test.setTestDate(request.getTestDate());

        test = laboratoryRepository.save(test);

        return mapToResponse(test);
    }

    @Override
    public void deleteTest(Long id) {

        LaboratoryTest test = laboratoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Laboratory test not found"));

        laboratoryRepository.delete(test);
    }

    private LaboratoryResponse mapToResponse(LaboratoryTest test) {

        return LaboratoryResponse.builder()
                .id(test.getId())
                .testCode(test.getTestCode())
                .patientId(test.getPatient().getId())
                .patientName(
                        test.getPatient().getFirstName() + " " +
                                test.getPatient().getLastName()
                )
                .doctorId(test.getDoctor().getId())
                .doctorName(
                        test.getDoctor().getFirstName() + " " +
                                test.getDoctor().getLastName()
                )
                .appointmentId(
                        test.getAppointment() != null
                                ? test.getAppointment().getId()
                                : null
                )
                .testName(test.getTestName())
                .sampleType(test.getSampleType())
                .testStatus(test.getTestStatus())
                .result(test.getResult())
                .remarks(test.getRemarks())
                .testDate(test.getTestDate())
                .build();
    }

    private String generateTestCode() {
        return "LAB-" + System.currentTimeMillis();
    }
}