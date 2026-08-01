package com.amanchougule.clinic_emr.consultation.service.impl;

import com.amanchougule.clinic_emr.appointment.entity.Appointment;
import com.amanchougule.clinic_emr.appointment.repository.AppointmentRepository;
import com.amanchougule.clinic_emr.consultation.dto.ConsultationRequest;
import com.amanchougule.clinic_emr.consultation.dto.ConsultationResponse;
import com.amanchougule.clinic_emr.consultation.entity.Consultation;
import com.amanchougule.clinic_emr.consultation.repository.ConsultationRepository;
import com.amanchougule.clinic_emr.consultation.service.ConsultationService;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public ConsultationResponse createConsultation(ConsultationRequest request) {

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found"));

        Consultation consultation = Consultation.builder()
                .consultationCode(generateConsultationCode())
                .appointment(appointment)
                .symptoms(request.getSymptoms())
                .diagnosis(request.getDiagnosis())
                .examination(request.getExamination())
                .doctorNotes(request.getDoctorNotes())
                .followUpDate(request.getFollowUpDate())
                .status(request.getStatus())
                .build();

        consultation = consultationRepository.save(consultation);

        return mapToResponse(consultation);
    }

    @Override
    public ConsultationResponse getConsultationById(Long id) {

        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Consultation not found"));

        return mapToResponse(consultation);
    }

    @Override
    public List<ConsultationResponse> getAllConsultations() {

        return consultationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ConsultationResponse updateConsultation(Long id,
                                                   ConsultationRequest request) {

        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Consultation not found"));

        consultation.setSymptoms(request.getSymptoms());
        consultation.setDiagnosis(request.getDiagnosis());
        consultation.setExamination(request.getExamination());
        consultation.setDoctorNotes(request.getDoctorNotes());
        consultation.setFollowUpDate(request.getFollowUpDate());
        consultation.setStatus(request.getStatus());

        consultation = consultationRepository.save(consultation);

        return mapToResponse(consultation);
    }

    @Override
    public void deleteConsultation(Long id) {

        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Consultation not found"));

        consultationRepository.delete(consultation);
    }

    private ConsultationResponse mapToResponse(Consultation consultation) {

        Appointment appointment = consultation.getAppointment();

        return ConsultationResponse.builder()
                .id(consultation.getId())
                .consultationCode(consultation.getConsultationCode())
                .appointmentId(appointment.getId())
                .patientName(
                        appointment.getPatient().getFirstName() + " "
                                + appointment.getPatient().getLastName()
                )
                .doctorName(
                        appointment.getDoctor().getFirstName() + " "
                                + appointment.getDoctor().getLastName()
                )
                .symptoms(consultation.getSymptoms())
                .diagnosis(consultation.getDiagnosis())
                .examination(consultation.getExamination())
                .doctorNotes(consultation.getDoctorNotes())
                .followUpDate(consultation.getFollowUpDate())
                .status(consultation.getStatus())
                .build();
    }

    private String generateConsultationCode() {
        return "CON-" + System.currentTimeMillis();
    }
}