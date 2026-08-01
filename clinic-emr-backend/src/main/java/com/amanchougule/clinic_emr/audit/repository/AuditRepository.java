package com.amanchougule.clinic_emr.audit.repository;

import com.amanchougule.clinic_emr.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuditRepository extends JpaRepository<AuditLog, Long> {

    Optional<AuditLog> findByAuditCode(String auditCode);

}