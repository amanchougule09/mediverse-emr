package com.amanchougule.clinic_emr.pharmacy.repository;

import com.amanchougule.clinic_emr.pharmacy.entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    Optional<Pharmacy> findByMedicineCode(String medicineCode);

    boolean existsByMedicineName(String medicineName);
}