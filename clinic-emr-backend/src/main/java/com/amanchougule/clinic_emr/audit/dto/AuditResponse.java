package com.amanchougule.clinic_emr.audit.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditResponse {

    private Long id;

    private String auditCode;

    private Long userId;

    private String username;

    private String action;

    private String entityName;

    private Long entityId;

    private String description;

    private String ipAddress;

    private LocalDateTime createdAt;

}