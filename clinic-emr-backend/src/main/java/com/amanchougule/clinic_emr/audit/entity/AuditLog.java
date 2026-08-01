package com.amanchougule.clinic_emr.audit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "audit_code", nullable = false, unique = true)
    private String auditCode;


    @Column(name = "user_id")
    private Long userId;


    private String username;


    @Column(nullable = false)
    private String action;


    @Column(name = "entity_name")
    private String entityName;


    @Column(name = "entity_id")
    private Long entityId;


    @Column(columnDefinition = "TEXT")
    private String description;


    @Column(name = "ip_address")
    private String ipAddress;


    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @Column(name = "updated_at")
    private LocalDateTime updatedAt;



    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

    }


    @PreUpdate
    public void preUpdate() {

        updatedAt = LocalDateTime.now();

    }
}