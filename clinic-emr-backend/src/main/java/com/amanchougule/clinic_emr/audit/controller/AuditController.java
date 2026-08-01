package com.amanchougule.clinic_emr.audit.controller;

import com.amanchougule.clinic_emr.audit.dto.AuditResponse;
import com.amanchougule.clinic_emr.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audits")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;


    @PostMapping
    @PreAuthorize("hasAuthority('audit:create')")
    public AuditResponse createAuditLog(
            @RequestParam Long userId,
            @RequestParam String username,
            @RequestParam String action,
            @RequestParam String entityName,
            @RequestParam(required = false) Long entityId,
            @RequestParam String description,
            @RequestParam(required = false) String ipAddress) {

        return auditService.createAuditLog(
                userId,
                username,
                action,
                entityName,
                entityId,
                description,
                ipAddress
        );
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('audit:view')")
    public AuditResponse getAuditById(
            @PathVariable Long id) {

        return auditService.getAuditById(id);
    }


    @GetMapping
    @PreAuthorize("hasAuthority('audit:view')")
    public List<AuditResponse> getAllAudits() {

        return auditService.getAllAudits();
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('audit:delete')")
    public String deleteAudit(
            @PathVariable Long id) {

        auditService.deleteAudit(id);

        return "Audit log deleted successfully.";
    }
}