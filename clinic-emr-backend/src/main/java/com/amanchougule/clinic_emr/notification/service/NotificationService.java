package com.amanchougule.clinic_emr.notification.service;

import com.amanchougule.clinic_emr.notification.dto.NotificationRequest;
import com.amanchougule.clinic_emr.notification.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    NotificationResponse getNotificationById(Long id);

    List<NotificationResponse> getAllNotifications();

    NotificationResponse updateNotification(Long id,
                                            NotificationRequest request);

    void deleteNotification(Long id);
}