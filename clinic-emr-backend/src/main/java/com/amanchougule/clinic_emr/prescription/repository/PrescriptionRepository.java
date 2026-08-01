package com.amanchougule.clinic_emr.prescription.repository;

import com.amanchougule.clinic_emr.prescription.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

}