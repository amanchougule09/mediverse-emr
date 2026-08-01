package com.amanchougule.clinic_emr.prescription.repository;

import com.amanchougule.clinic_emr.prescription.entity.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionItemRepository
        extends JpaRepository<PrescriptionItem, Long> {
}