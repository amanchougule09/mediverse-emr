package com.amanchougule.clinic_emr.consultation.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationRequest {

    private Long appointmentId;

    private String symptoms;

    private String diagnosis;

    private String examination;

    private String doctorNotes;

    private LocalDate followUpDate;

    private String status;
}