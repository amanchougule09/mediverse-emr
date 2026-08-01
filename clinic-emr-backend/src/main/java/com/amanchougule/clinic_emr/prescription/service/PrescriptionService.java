package com.amanchougule.clinic_emr.prescription.service;

import com.amanchougule.clinic_emr.prescription.dto.PrescriptionRequest;
import com.amanchougule.clinic_emr.prescription.dto.PrescriptionResponse;

import java.util.List;

public interface PrescriptionService {

    PrescriptionResponse createPrescription(PrescriptionRequest request);

    PrescriptionResponse getPrescriptionById(Long id);

    List<PrescriptionResponse> getAllPrescriptions();

    PrescriptionResponse updatePrescription(Long id,
                                            PrescriptionRequest request);

    void deletePrescription(Long id);
}