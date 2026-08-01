package com.amanchougule.clinic_emr.notification.repository;

import com.amanchougule.clinic_emr.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Optional<Notification> findByNotificationCode(String notificationCode);

}