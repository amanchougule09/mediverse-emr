package com.amanchougule.clinic_emr.notification.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {

    private Long patientId;

    private Long doctorId;

    private String title;

    private String message;

    private String notificationType;

    private String notificationStatus;
}