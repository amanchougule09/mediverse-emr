package com.amanchougule.clinic_emr.appointment.repository;

import com.amanchougule.clinic_emr.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByAppointmentCode(String appointmentCode);

}