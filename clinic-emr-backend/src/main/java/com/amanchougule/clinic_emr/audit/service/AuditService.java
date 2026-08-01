package com.amanchougule.clinic_emr.audit.service;

import com.amanchougule.clinic_emr.audit.dto.AuditResponse;

import java.util.List;

public interface AuditService {

    AuditResponse createAuditLog(
            Long userId,
            String username,
            String action,
            String entityName,
            Long entityId,
            String description,
            String ipAddress
    );


    AuditResponse getAuditById(Long id);


    List<AuditResponse> getAllAudits();


    void deleteAudit(Long id);

}