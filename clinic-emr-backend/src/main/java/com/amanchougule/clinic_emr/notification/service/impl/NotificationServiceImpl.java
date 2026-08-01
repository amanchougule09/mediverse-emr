package com.amanchougule.clinic_emr.notification.service.impl;

import com.amanchougule.clinic_emr.doctor.entity.Doctor;
import com.amanchougule.clinic_emr.doctor.repository.DoctorRepository;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import com.amanchougule.clinic_emr.notification.dto.NotificationRequest;
import com.amanchougule.clinic_emr.notification.dto.NotificationResponse;
import com.amanchougule.clinic_emr.notification.entity.Notification;
import com.amanchougule.clinic_emr.notification.repository.NotificationRepository;
import com.amanchougule.clinic_emr.notification.service.NotificationService;
import com.amanchougule.clinic_emr.patient.entity.Patient;
import com.amanchougule.clinic_emr.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {

        Patient patient = null;
        Doctor doctor = null;

        if (request.getPatientId() != null) {
            patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Patient not found"));
        }

        if (request.getDoctorId() != null) {
            doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Doctor not found"));
        }

        Notification notification = Notification.builder()
                .notificationCode(generateNotificationCode())
                .patient(patient)
                .doctor(doctor)
                .title(request.getTitle())
                .message(request.getMessage())
                .notificationType(request.getNotificationType())
                .notificationStatus(request.getNotificationStatus())
                .build();

        notification = notificationRepository.save(notification);

        return mapToResponse(notification);
    }

    @Override
    public NotificationResponse getNotificationById(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found"));

        return mapToResponse(notification);
    }

    @Override
    public List<NotificationResponse> getAllNotifications() {

        return notificationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public NotificationResponse updateNotification(Long id,
                                                   NotificationRequest request) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found"));

        Patient patient = null;
        Doctor doctor = null;

        if (request.getPatientId() != null) {
            patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Patient not found"));
        }

        if (request.getDoctorId() != null) {
            doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Doctor not found"));
        }

        notification.setPatient(patient);
        notification.setDoctor(doctor);
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setNotificationType(request.getNotificationType());
        notification.setNotificationStatus(request.getNotificationStatus());

        notification = notificationRepository.save(notification);

        return mapToResponse(notification);
    }

    @Override
    public void deleteNotification(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found"));

        notificationRepository.delete(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .notificationCode(notification.getNotificationCode())
                .patientId(notification.getPatient() != null ? notification.getPatient().getId() : null)
                .patientName(notification.getPatient() != null
                        ? notification.getPatient().getFirstName() + " " + notification.getPatient().getLastName()
                        : null)
                .doctorId(notification.getDoctor() != null ? notification.getDoctor().getId() : null)
                .doctorName(notification.getDoctor() != null
                        ? notification.getDoctor().getFirstName() + " " + notification.getDoctor().getLastName()
                        : null)
                .title(notification.getTitle())
                .message(notification.getMessage())
                .notificationType(notification.getNotificationType())
                .notificationStatus(notification.getNotificationStatus())
                .sentAt(notification.getSentAt())
                .build();
    }

    private String generateNotificationCode() {
        return "NOT-" + System.currentTimeMillis();
    }
}