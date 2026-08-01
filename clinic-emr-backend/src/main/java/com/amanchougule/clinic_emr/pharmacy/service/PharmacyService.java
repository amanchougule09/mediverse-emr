package com.amanchougule.clinic_emr.pharmacy.service;

import com.amanchougule.clinic_emr.pharmacy.dto.PharmacyRequest;
import com.amanchougule.clinic_emr.pharmacy.dto.PharmacyResponse;

import java.util.List;

public interface PharmacyService {

    PharmacyResponse createMedicine(PharmacyRequest request);

    PharmacyResponse getMedicineById(Long id);

    List<PharmacyResponse> getAllMedicines();

    PharmacyResponse updateMedicine(Long id, PharmacyRequest request);

    void deleteMedicine(Long id);
}