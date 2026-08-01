package com.amanchougule.clinic_emr.notification.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;

    private String notificationCode;

    private Long patientId;

    private String patientName;

    private Long doctorId;

    private String doctorName;

    private String title;

    private String message;

    private String notificationType;

    private String notificationStatus;

    private LocalDateTime sentAt;
}