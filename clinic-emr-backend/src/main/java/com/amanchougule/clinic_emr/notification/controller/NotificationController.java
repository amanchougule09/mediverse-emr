package com.amanchougule.clinic_emr.notification.controller;

import com.amanchougule.clinic_emr.notification.dto.NotificationRequest;
import com.amanchougule.clinic_emr.notification.dto.NotificationResponse;
import com.amanchougule.clinic_emr.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @PreAuthorize("hasAuthority('notification:create')")
    public NotificationResponse createNotification(
            @Valid @RequestBody NotificationRequest request) {

        return notificationService.createNotification(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('notification:view')")
    public NotificationResponse getNotificationById(
            @PathVariable Long id) {

        return notificationService.getNotificationById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('notification:view')")
    public List<NotificationResponse> getAllNotifications() {

        return notificationService.getAllNotifications();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('notification:update')")
    public NotificationResponse updateNotification(
            @PathVariable Long id,
            @Valid @RequestBody NotificationRequest request) {

        return notificationService.updateNotification(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('notification:delete')")
    public String deleteNotification(
            @PathVariable Long id) {

        notificationService.deleteNotification(id);

        return "Notification deleted successfully.";
    }
}