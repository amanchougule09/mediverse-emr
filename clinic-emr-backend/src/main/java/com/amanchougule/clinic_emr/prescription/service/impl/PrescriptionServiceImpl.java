package com.amanchougule.clinic_emr.prescription.service.impl;

import com.amanchougule.clinic_emr.appointment.entity.Appointment;
import com.amanchougule.clinic_emr.appointment.repository.AppointmentRepository;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import com.amanchougule.clinic_emr.patient.entity.Patient;
import com.amanchougule.clinic_emr.prescription.dto.*;
import com.amanchougule.clinic_emr.prescription.entity.Prescription;
import com.amanchougule.clinic_emr.prescription.entity.PrescriptionItem;
import com.amanchougule.clinic_emr.prescription.repository.PrescriptionRepository;
import com.amanchougule.clinic_emr.prescription.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        Prescription prescription = Prescription.builder()
                .prescriptionCode(generatePrescriptionCode())
                .appointment(appointment)
                .patient(appointment.getPatient())
                .doctor(appointment.getDoctor())
                .diagnosis(request.getDiagnosis())
                .advice(request.getAdvice())
                .build();

        if (request.getItems() != null) {

            for (PrescriptionItemRequest itemRequest : request.getItems()) {

                PrescriptionItem item = PrescriptionItem.builder()
                        .medicineName(itemRequest.getMedicineName())
                        .dosage(itemRequest.getDosage())
                        .frequency(itemRequest.getFrequency())
                        .duration(itemRequest.getDuration())
                        .instructions(itemRequest.getInstructions())
                        .prescription(prescription)
                        .build();

                prescription.getItems().add(item);
            }
        }

        prescription = prescriptionRepository.save(prescription);

        return mapToResponse(prescription);
    }

    @Override
    public PrescriptionResponse getPrescriptionById(Long id) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Prescription not found"));

        return mapToResponse(prescription);
    }

    @Override
    public List<PrescriptionResponse> getAllPrescriptions() {

        return prescriptionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public PrescriptionResponse updatePrescription(Long id,
                                                   PrescriptionRequest request) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Prescription not found"));

        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setAdvice(request.getAdvice());

        prescription.getItems().clear();

        if (request.getItems() != null) {

            for (PrescriptionItemRequest itemRequest : request.getItems()) {

                PrescriptionItem item = PrescriptionItem.builder()
                        .medicineName(itemRequest.getMedicineName())
                        .dosage(itemRequest.getDosage())
                        .frequency(itemRequest.getFrequency())
                        .duration(itemRequest.getDuration())
                        .instructions(itemRequest.getInstructions())
                        .prescription(prescription)
                        .build();

                prescription.getItems().add(item);
            }
        }

        prescription = prescriptionRepository.save(prescription);

        return mapToResponse(prescription);
    }

    @Override
    public void deletePrescription(Long id) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Prescription not found"));

        prescriptionRepository.delete(prescription);
    }

    private PrescriptionResponse mapToResponse(Prescription prescription) {

        Patient patient = prescription.getPatient();

        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .prescriptionCode(prescription.getPrescriptionCode())

                .appointmentId(prescription.getAppointment().getId())

                .patientId(patient.getId())
                .patientName(patient.getFirstName() + " " + patient.getLastName())

                .doctorId(prescription.getDoctor().getId())
                .doctorName(
                        prescription.getDoctor().getFirstName() + " " +
                                prescription.getDoctor().getLastName()
                )

                .diagnosis(prescription.getDiagnosis())
                .advice(prescription.getAdvice())

                .items(
                        prescription.getItems()
                                .stream()
                                .map(item -> PrescriptionItemResponse.builder()
                                        .id(item.getId())
                                        .medicineName(item.getMedicineName())
                                        .dosage(item.getDosage())
                                        .frequency(item.getFrequency())
                                        .duration(item.getDuration())
                                        .instructions(item.getInstructions())
                                        .build())
                                .toList()
                )

                .build();
    }

    private String generatePrescriptionCode() {
        return "RX-" + System.currentTimeMillis();
    }
}