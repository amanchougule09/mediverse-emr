package com.amanchougule.clinic_emr.audit.service.impl;

import com.amanchougule.clinic_emr.audit.dto.AuditResponse;
import com.amanchougule.clinic_emr.audit.entity.AuditLog;
import com.amanchougule.clinic_emr.audit.repository.AuditRepository;
import com.amanchougule.clinic_emr.audit.service.AuditService;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {


    private final AuditRepository auditRepository;


    @Override
    public AuditResponse createAuditLog(
            Long userId,
            String username,
            String action,
            String entityName,
            Long entityId,
            String description,
            String ipAddress) {


        AuditLog auditLog = AuditLog.builder()
                .auditCode(generateAuditCode())
                .userId(userId)
                .username(username)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .description(description)
                .ipAddress(ipAddress)
                .build();


        auditLog = auditRepository.save(auditLog);

        return mapToResponse(auditLog);
    }


    @Override
    public AuditResponse getAuditById(Long id) {

        AuditLog auditLog = auditRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Audit log not found"));

        return mapToResponse(auditLog);
    }


    @Override
    public List<AuditResponse> getAllAudits() {

        return auditRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Override
    public void deleteAudit(Long id) {

        AuditLog auditLog = auditRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Audit log not found"));

        auditRepository.delete(auditLog);
    }


    private AuditResponse mapToResponse(AuditLog auditLog) {

        return AuditResponse.builder()
                .id(auditLog.getId())
                .auditCode(auditLog.getAuditCode())
                .userId(auditLog.getUserId())
                .username(auditLog.getUsername())
                .action(auditLog.getAction())
                .entityName(auditLog.getEntityName())
                .entityId(auditLog.getEntityId())
                .description(auditLog.getDescription())
                .ipAddress(auditLog.getIpAddress())
                .createdAt(auditLog.getCreatedAt())
                .build();
    }


    private String generateAuditCode() {

        return "AUD-" + System.currentTimeMillis();

    }
}