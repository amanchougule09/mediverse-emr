package com.amanchougule.clinic_emr.consultation.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationResponse {

    private Long id;

    private String consultationCode;

    private Long appointmentId;

    private String patientName;

    private String doctorName;

    private String symptoms;

    private String diagnosis;

    private String examination;

    private String doctorNotes;

    private LocalDate followUpDate;

    private String status;
}